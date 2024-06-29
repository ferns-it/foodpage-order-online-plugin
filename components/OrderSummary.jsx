import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Fa from "react-icons/fa";
import * as Io from "react-icons/io";
import { OrderOnlineContext } from "../context/OrderOnlineContext";
import Utils from "../utils/Utils";
import "../style/OrderOnlineApp.css";
import { toast, Toaster } from "react-hot-toast";
import moment from "moment";
import axios from "axios";
import { useParams } from "react-router-dom";

function OrderSummary() {
  const { shopUrl } = useParams();

  const {
    cartItems,
    deleteSingleCartItem,
    cartLoading,
    fetchCartList,
    locationResponse,
    menuList,
    settings,
    getShopSettings,
    delivery,
    setDelivery,
    locationResponseData,
    setLocationResponseData,
    setisCheckoutActive,
  } = useContext(OrderOnlineContext);

  const [showAddons, setShowAddons] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [locationData, setLocationData] = useState(null);
  const [takeawayTime, setTakeawayTime] = useState("");
  const [error, setError] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [convertedDistance, setConvertedDistance] = useState(null);
  const [time, setTime] = useState("");
  const [takeaway, setTakeaway] = useState(null);
  const [takeawayTotal, setTakeawayTotal] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  let distanceRange = 0;

  useEffect(() => {
    if (!shopUrl) return;
    getShopSettings(shopUrl);
    const time = Utils.getCurrentTime();
    setTime(time);
  }, []);

  useEffect(() => {
    if (!menuList) return;
    const info = settings != null && settings?.deliveryInfo;
    setDeliveryInfo(info);
  }, [menuList]);

  useEffect(() => {
    const calculateDiscounts = () => {
      const subtotal = cartItems?.cartTotal?.cartTotalPrice / 100;

      let homeDeliveryDiscount = 0;
      let takeawayDiscount = 0;

      if (subtotal >= deliveryInfo?.minAmtForHomDelvryDiscnt) {
        homeDeliveryDiscount =
          subtotal * (deliveryInfo?.discountHomeDelivery / 100);
      }

      if (subtotal >= deliveryInfo?.minAmtForTakAwayDiscnt) {
        takeawayDiscount = subtotal * (deliveryInfo?.discountTakeAway / 100);
      }

      setDiscount(homeDeliveryDiscount.toFixed(2));
      setTakeaway(takeawayDiscount.toFixed(2));
      setAllTotal((subtotal - homeDeliveryDiscount).toFixed(2));
      setTakeawayTotal((subtotal - takeawayDiscount).toFixed(2));
    };

    if (cartItems && deliveryInfo) {
      calculateDiscounts();
    }
  }, [cartItems, deliveryInfo]);

  const processLocationData = (locationData) => {
    if (!locationData) return;
    const mileToKMConversionFactor = 0.62137119;
    const distanceText = locationData?.distance?.text;

    if (!distanceText) {
      // console.log("Unavailable distance text");
      return "Data Unavailable";
    }

    const numericDistanceKM = parseFloat(distanceText.match(/[\d\.]+/)[0]);
    console.log(numericDistanceKM, "numeric");
    if (isNaN(numericDistanceKM)) {
      // console.log("Invalid distance data");
      return "Invalid Distance Data";
    }

    let actualDistance;
    if (deliveryInfo?.distanceType === "Mile") {
      actualDistance = (numericDistanceKM * mileToKMConversionFactor).toFixed(
        2
      );
    } else {
      actualDistance = numericDistanceKM.toFixed(2);
    }

    setConvertedDistance(actualDistance);
    return actualDistance;
  };

  const fetchDistance = async () => {
    if (postalCode == null) {
      console.log("Invalid postcode!");
      return;
    }

    if (deliveryInfo?.shopPostcode && postalCode) {
      let origin = deliveryInfo?.shopPostcode;
      let destination = postalCode;

      try {
        setLocationLoading(true);
        const response = await axios.get(
          `https://foodpage.co.uk/development/v2/shop/service/delivery?origins=${origin}&destinations=${destination}&units=matrix`
        );

        if (response.data) {
          setLocationResponseData(response.data);

          const locationDataValue = response.data;
          // console.log(locationDataValue);
          if (!locationDataValue?.data) {
            toast.error("Location data not loaded or invalid!");
            return true;
          }

          const element = locationDataValue?.data?.rows[0].elements[0];
          const elementStatus = element.status;

          if (elementStatus === "NOT_FOUND") {
            toast.error("Postal code Not Found!");
            return true;
          }

          if (elementStatus === "ZERO_RESULTS") {
            toast.error("Delivery Not Available in this Location!");
            return true;
          }

          if (elementStatus === "OK") {
            setLocationData(element);

            // console.log(element);

            const actualDistance = processLocationData(element);

            // console.log(actualDistance);

            if (
              actualDistance !== undefined &&
              parseFloat(deliveryInfo?.maxDeliveryRadius) >=
                parseFloat(actualDistance)
            ) {
              sessionStorage.setItem("distance", actualDistance.toString());
              return false;
            } else {
              toast.error("Location is outside the delivery radius.");
              return true;
            }
          }
        } else {
          toast.error("Error on fetching location data");
          return true;
        }
      } catch (error) {
        console.error("Error on fetching location:", error);
        toast.error("Failed to fetch location data");
        return true;
      } finally {
        setLocationLoading(false);
      }
    } else {
      return;
    }
  };

  const handleAddress = async () => {
    if (cartItems?.cartItems?.length === 0) {
      toast("Your cart is empty!");
      return;
    }

    if (delivery === false) {
      // console.log(postalCode);
      if (postalCode == "" || postalCode == null) {
        toast.error("Please add Details of Delivery!");
        return;
      }
      const isLocationValidationErr = await fetchDistance();

      if (isLocationValidationErr === false) {
        toast.success("success");
        sessionStorage.setItem("postcode", postalCode);
        sessionStorage.setItem("type", delivery);
        setisCheckoutActive(true);
      } else {
        setisCheckoutActive(false);
      }
      return;
    }

    if (delivery === true) {
      if (time == null) {
        toast.error("Please Choose Takeaway Time!");
        setisCheckoutActive(false);
        return;
      } else {
        sessionStorage.setItem("type", delivery);
        setisCheckoutActive(true);
      }
    }
  };

  const toggleFoodLists = (index) => {
    if (index < 0) return;
    setShowAddons((prevList) => {
      const newList = Array.isArray(prevList) ? [...prevList] : [];
      const indexPosition = newList.indexOf(index);

      if (indexPosition === -1) {
        newList.push(index);
      } else {
        newList.splice(indexPosition, 1);
      }
      return newList;
    });
  };

  const handleDeleteItem = async (id, index) => {
    if (!id) return;
    setDeleteIndex(index);
    await deleteSingleCartItem(id, {
      onSuccess: async (res) => {
        await fetchCartList();

        toast.success("Item removed from your cart");
      },
      onFailed: (err) => {
        toast.error("Delete cart item failed!");
      },
    });
  };

  const validateCurrentTime = (event) => {
    const currentTime = new Date();
    const [hours, minutes] = event.target.value.split(":");
    const takeawayTimeData = new Date();
    takeawayTimeData.setHours(parseInt(hours, 10));
    takeawayTimeData.setMinutes(parseInt(minutes, 10));

    let status;

    switch (true) {
      case takeawayTimeData.getTime() === currentTime.getTime():
        status = {
          status: false,
          message: "Current time is not permitted for takeaway!",
        };
        break;
      case takeawayTimeData < currentTime:
        status = {
          status: false,
          message:
            "Taking away a time earlier than the current time is not allowed!",
        };
        toast.error("Less than 30 minutes from Current Time is not allowed!");
        return;
        break;
      case takeawayTimeData.getTime() - currentTime.getTime() < 30 * 60 * 1000:
        status = {
          status: false,
          message: "Less than 30 minutes from Current Time",
        };
        toast.error("Less than 30 minutes from Current Time is not allowed!");
        return;
        break;
      default:
        status = {
          status: true,
          message: "",
        };
    }

    setError(status.message);
    setTime(event.target.value);
  };

  console.log(cartItems);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <h3 className="order_title">Order Summary</h3>
      <div className="summary_item_wrapper_029">
        {cartItems && cartItems.cartItems.length != 0 ? (
          <div className="summary_card card">
            {cartItems &&
              cartItems.cartItems.map((item, index) => {
                // console.log(item);
                const addOns = item?.addon_apllied;
                const masterAddons = item?.master_addon_apllied;
                return (
                  <Fragment>
                    <div className="position-relative mb-4" key={index}>
                      <div className="d-flex">
                        <p className="food_menu m-0 food_title_299">
                          <strong>{item?.productName ?? "N/A"} - </strong>
                        </p>
                        <p className="qty_order_summary">{item?.quantity}</p>
                        <p className="price_summary_1">
                          {item?.product_total_price}
                        </p>
                      </div>
                      <div
                        className={`add_ons_wrapper_order_summary ${
                          showAddons && showAddons.includes(index) ? "show" : ""
                        }`}
                      >
                        <table className="addOnsList028">
                          {addOns &&
                            addOns.length != 0 &&
                            addOns.map((add, index) => {
                              return (
                                <Fragment>
                                  <span key={index}>
                                    <strong>{add?.title}</strong>
                                  </span>
                                  {add &&
                                    add.choosedOption.length != 0 &&
                                    add.choosedOption.map((data, index) => {
                                      return (
                                        <tr>
                                          <td>{data?.text}</td>
                                          <td>{data?.price}</td>
                                        </tr>
                                      );
                                    })}
                                </Fragment>
                              );
                            })}
                        </table>
                        <table className="addOnsList028">
                          {masterAddons &&
                            masterAddons.length != 0 &&
                            masterAddons.map((add, index) => {
                              return (
                                <Fragment>
                                  <span key={index}>
                                    <strong>{add?.title}</strong>
                                  </span>
                                  {add &&
                                    add.choosedOption.length != 0 &&
                                    add.choosedOption.map((data, index) => {
                                      return (
                                        <tr key={index}>
                                          <td>{data?.text}</td>
                                          <td>{data?.price}</td>
                                        </tr>
                                      );
                                    })}
                                </Fragment>
                              );
                            })}
                        </table>
                      </div>

                      <div className="d-flex mt-2">
                        {(addOns && addOns.length != 0) ||
                        (masterAddons && masterAddons.length != 0) ? (
                          <button
                            className="summary_addons_collapse_btn"
                            onClick={() => toggleFoodLists(index)}
                          >
                            {showAddons && showAddons.includes(index) ? (
                              <Fragment>
                                <Io.IoIosArrowRoundUp /> <span>Know less</span>
                              </Fragment>
                            ) : (
                              <Fragment>
                                <Io.IoIosArrowRoundDown />{" "}
                                <span>Know more</span>
                              </Fragment>
                            )}
                          </button>
                        ) : (
                          ""
                        )}
                        <button
                          type="button"
                          className="remove"
                          onClick={() => handleDeleteItem(item?.cartID, index)}
                          disabled={cartLoading && deleteIndex === index}
                        >
                          {cartLoading && deleteIndex === index ? (
                            <span
                              class="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <Fa.FaRegTrashAlt />
                          )}
                        </button>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            <hr className="mt-0" />
            <table className="total_cost_summary">
              {delivery == true ? (
                <>
                  <Fragment>
                    <tr className="discount_order_summary">
                      <td>Sub Total</td>
                      <td>{cartItems?.cartTotal?.cartTotalPriceDisplay}</td>
                    </tr>
                    <tr className="discount_order_summary">
                      <td>Discount</td>
                      <td>-£{takeaway}</td>
                    </tr>
                    <tr>
                      <td>Total Cost</td>
                      <td>£{takeawayTotal ?? "N/A"}</td>
                    </tr>
                  </Fragment>
                </>
              ) : (
                <>
                  <Fragment>
                    <tr className="discount_order_summary">
                      <td>Sub Total</td>
                      <td id="sub_total_amt_order_summary">
                        {cartItems?.cartTotal?.cartTotalPriceDisplay}
                      </td>
                    </tr>
                    <tr className="discount_order_summary">
                      <td>Discount</td>
                      <td>-£ {discount}</td>
                    </tr>
                    <tr>
                      <td>Total Cost</td>
                      <td>£ {allTotal ?? "N/A"}</td>
                    </tr>
                  </Fragment>
                </>
              )}
            </table>
          </div>
        ) : (
          <h3 className="empty_indic_order_summary">No items added yet!</h3>
        )}
      </div>

      <br />
      <div className="line__"></div>

      <div className="row mt-3 mx-auto mx-auto" style={{ display: "flex" }}>
        <div className="col-md-6" style={{ flex: 1 }}>
          <input
            type="radio"
            className="radio_btn"
            checked={!delivery}
            onChange={() => setDelivery(false)}
          />
          <label onClick={() => setDelivery(false)}> Delivery</label>
        </div>
        {deliveryInfo?.takeAway == 1 && (
          <div className="col-md-6" style={{ flex: 1 }}>
            <input
              type="radio"
              className="radio_btn"
              onClick={() => setDelivery(true)}
              checked={delivery}
              onChange={() => setDelivery(true)}
            />
            <label onClick={() => setDelivery(true)}> Takeaway</label>
          </div>
        )}
      </div>

      <div className="row">
        {delivery == false ? (
          <div>
            <label htmlFor="" className="opt_label_827">
              Postal Code
            </label>
            <div className="inp_wrapper_827">
              <input
                type="text"
                name=""
                id=""
                className="opt_input_827"
                placeholder="Please enter postal code!"
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="takeaway-time" className="opt_label_827">
              Pickup Time
            </label>
            <div className="inp_wrapper_827">
              <input
                type="time"
                name=""
                id=""
                className={
                  error && takeawayTime.length == 0
                    ? "opt_input_827 err__"
                    : "opt_input_827"
                }
                onChange={validateCurrentTime}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="mt-2 text-center">
              <small className="">
                Your Food will be ready in just
                {" " + deliveryInfo?.minWaitingTime} minutes!{" "}
              </small>
            </div>
          </div>
        )}
      </div>

      {(error && postalCode.length == 0) ||
      (error && takeawayTime.length == 0) ? (
        <span className="err_msg_order_summary">
          * Please fill required fields!
        </span>
      ) : (
        ""
      )}
      <button
        type="button"
        className="order_now_192"
        onClick={handleAddress}
        disabled={
          !cartItems ||
          cartItems.cartItems.length == 0 ||
          locationLoading === true
        }
      >
        {!locationLoading ? (
          "Order Now"
        ) : (
          <div
            class="spinner-border spinner-border-sm text-light"
            role="status"
          ></div>
        )}
      </button>
    </div>
  );
}

export default OrderSummary;
