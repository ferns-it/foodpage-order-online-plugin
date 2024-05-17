import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Fa from "react-icons/fa";
import * as Io from "react-icons/io";
import { OrderOnlineContext } from "../context/OrderOnlineContext";
import Utils from "../utils/Utils";
import "../style/OrderOnlineApp.css";
import { toast, Toaster } from "react-hot-toast";
import moment from "moment";

function OrderSummary() {
  const {
    cartItems,
    deleteSingleCartItem,
    cartLoading,
    fetchCartList,
    getLocation,
    locationResponse,
    menuList,
    settings,
    getShopSettings,
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
  const [delivery, setDelivey] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [postalCode, setPostalCode] = useState("");

  let distanceRange = 0;

  useEffect(() => {
    const shopUrl = "le-arabia";
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

  useEffect(() => {
    const fetchDistance = async () => {
      if (postalCode == null) {
        return;
      } else {
        if (deliveryInfo?.shopPostcode && postalCode) {
          try {
            const res = await getLocation(
              deliveryInfo?.shopPostcode,
              postalCode
            );
            if (res.error) {
              console.error("Failed to fetch distance");
            } else {
              // console.log(res.data);
            }
          } catch (error) {
            console.error("Error fetching distance: " + error.message);
          }
        } else {
          // toast.error("Postcodes not available.");
          return;
        }
      }
    };

    fetchDistance();
  }, [deliveryInfo?.shopPostcode, postalCode]);

  console.log(locationResponse, "response");

  const handleAddress = () => {
    if (cartItems?.cartItems?.length === 0) {
      toast("Your cart is empty!");
      return;
    }

    if (delivery === false) {
      if (postalCode == "" || postalCode == null) {
        toast.error("Please add Details of Delivery!");
        return;
      }
      if (!locationResponse?.data) {
        toast.error("Location data not loaded or invalid!");
        return;
      }

      const element = locationResponse?.data?.rows[0].elements[0];
      console.log(element, "elemeny");
      const elementStatus = element.status;

      if (elementStatus === "NOT_FOUND") {
        toast.error("Postal code Not Found!");

        return;
      } else if (elementStatus === "ZERO_RESULTS") {
        toast.error("Delivery Not Available in this Location!");

        return;
      } else if (elementStatus === "OK") {
        setLocationData(locationResponse?.data?.rows[0].elements[0]);
        console.log(locationData, "logged");
        const actualDistance = processLocationData(locationData);
        sessionStorage.setItem("postcode", postalCode);
        sessionStorage.setItem("type", delivery);
        sessionStorage.setItem("distance", actualDistance.toString());

        if (
          actualDistance !== undefined &&
          parseFloat(deliveryInfo?.maxDeliveryRadius) >=
            parseFloat(actualDistance)
        ) {
          // navigate("/guest_login");
          toast("success");
        } else {
          toast.error("Location is outside the delivery radius.");
        }
      } else {
        toast.error("Error with location data!");
      }
    } else {
      if (time == null) {
        toast.error("Please Choose Takeaway Time!");
        return;
      } else {
        sessionStorage.setItem("type", delivery);
        // navigate("/guest_login");
        toast("takeaway success");
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
  console.log(error);
  const handleTimeChange = (event) => {
    const newTime = event.target.value;
    setTime(newTime);
  };

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
                        <p className="food_menu m-0">
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
      <div className="row mt-3 mx-auto text-center">
        <div className="col-md-5 col-sm-12">
          <input
            type="radio"
            className="radio_btn"
            checked={!delivery}
            onChange={() => setDelivey(false)}
          />
          <label className="radio_label">Delivery</label>
        </div>
        {deliveryInfo?.takeAway == 1 && (
          <>
            <div className="col-md-7 col-sm-12">
              <input
                type="radio"
                className="radio_btn"
                onClick={() => setDelivey(true)}
                checked={delivery}
                onChange={() => setDelivey(true)}
              />
              <label className="radio_label">Take away</label>
            </div>
          </>
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
          !cartItems || cartItems.cartItems.length == 0 || error.length != 0
        }
      >
        Order Now
      </button>
    </div>
  );
}

export default OrderSummary;
