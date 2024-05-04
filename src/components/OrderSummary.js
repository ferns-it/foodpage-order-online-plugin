import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Fa from "react-icons/fa";
import * as Io from "react-icons/io";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Utils from "../utils/Utils";

function OrderSummary() {
  const {
    cartItems,
    deleteSingleCartItem,
    cartLoading,
    fetchCartList,
    getLocation,
    locationResponse,
    settings,
    getShopSettings,
  } = useContext(AppContext);

  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [showAddons, setShowAddons] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [postalcode, setPostalcode] = useState("");
  const [takeawayTime, setTakeawayTime] = useState("");
  const [error, setError] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [takeaway, setTakeaway] = useState(null);
  const [takeawayTotal, setTakeawayTotal] = useState(null);
  const [orderCounts, setOrderCounts] = useState([]);
  // const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  // const [deliveryCharges, setDeliveryCharges] = useState(null);

  let distanceRange = 0;

  useEffect(() => {
    const shopUrl = "le-arabia";
    getShopSettings(shopUrl);

    const time = Utils.getCurrentTime();
    setTakeawayTime(time);
  }, []);

  useEffect(() => {
    if (!cartItems) return;
    const cartData = cartItems.cartItems;
    const initialCounts =
      cartData && cartData.map((item) => parseInt(item.quantity, 10) || 0);
    setOrderCounts(initialCounts);
  }, [cartItems]);

  useEffect(() => {
    const dis = cartItems?.cartTotal?.cartTotalPrice / 100;
    const deliveryInfo = settings?.deliveryInfo;

    if (dis >= deliveryInfo?.minAmtForHomDelvryDiscnt) {
      const amt = dis * (deliveryInfo?.discountHomeDelivery / 100);
      setDiscount(amt.toFixed(2));
      setAllTotal((dis - amt).toFixed(2));
    } else {
      setDiscount(0);
      setAllTotal(dis.toFixed(2));
    }
    if (dis >= deliveryInfo?.minAmtForTakAwayDiscnt) {
      const amt = dis * (deliveryInfo?.discountTakeAway / 100);
      setTakeaway(amt.toFixed(2));
      setTakeawayTotal((dis - amt).toFixed(2));
    } else {
      setTakeaway(0);
      setTakeawayTotal(dis.toFixed(2));
    }
  }, [cartItems]);

  const getLocationDetails = async () => {
    if (!settings) return;
    const deliveryInfo = settings?.deliveryInfo ?? null;
    if (!deliveryInfo) return;
    let shopPostalCode = deliveryInfo?.shopPostcode;
    console.log(postalcode);
    if (!postalcode || postalcode.length == 0) return;
    console.log(shopPostalCode, postalcode);
    console.log(shopPostalCode);
    await getLocation(shopPostalCode, postalcode);
  };

  const handleAddress = () => {
    getLocationDetails();

    if (!locationResponse) return;

    const elementStatus = locationResponse.rows[0].elements[0].status;

    if (elementStatus === "NOT_FOUND") {
      toast.error("Postal code Not Found!");
      return false;
    }
    if (elementStatus === "ZERO_RESULTS") {
      toast.error("Delivery Not Available in this Location!");
      return false;
    }
    return true;
    // sessionStorage.setItem("postcode", postalcode);
    // sessionStorage.setItem("locationDetails", JSON.stringify(locationResponse));
  };

  const fetchDistanceData = () => {
    if (!locationResponse || !settings || !settings.deliveryInfo) return;
    let customerDistance =
      locationResponse?.rows[0]?.elements[0]?.distance?.value;

    let km = customerDistance / 1000;
    let distanceInMiles = km * 0.621371;
    let roundedDistanceInMiles = parseInt(distanceInMiles.toFixed(2));

    distanceRange = roundedDistanceInMiles;
  };

  const handleDecreaseOrderSummary = (index) => {
    setOrderCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      if (newCounts[index] > 0) {
        newCounts[index] -= 1;
      }
      return [...newCounts];
    });
  };

  const handleIncreaseOrderSummary = (index) => {
    setOrderCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[index] += 1;
      return [...newCounts];
    });
  };

  // const isValidRadiusCheck = () => {
  //   if (!locationResponse || !settings || !settings.deliveryInfo) return;

  //   const deliveryData = settings?.deliveryInfo;
  //   if (!deliveryData) return;

  //   let distanceType = deliveryData?.distanceType;
  //   let freeDelivery = parseInt(deliveryData?.freeDelivery);
  //   let freeDeliveryRadius = parseInt(deliveryData?.freeDeliveryRadius);
  //   let deliveryChargeType = deliveryData?.deliveryChargeType;
  //   let ratePerMile = deliveryData?.ratePerMile;
  //   let customerDistance =
  //     locationResponse?.rows[0]?.elements[0]?.distance?.value;

  //   let km = customerDistance / 1000;
  //   let distanceInMiles = km * 0.621371;
  //   let roundedDistanceInMiles = parseInt(distanceInMiles.toFixed(2));

  //   let freeDeliveryCondition =
  //     freeDelivery == 1 && roundedDistanceInMiles < freeDeliveryRadius;

  //   if (freeDeliveryCondition === true) {
  //     setIsFreeDelivery(true);
  //     setDeliveryCharges({ charge: 0, ratePerMile: 0 });
  //   } else {
  //     setIsFreeDelivery(false);
  //   }

  //   if (isFreeDelivery == false) {
  //     console.log("reached false");
  //     const excessDistance = distanceInMiles - freeDeliveryRadius;
  //     const deliveryCharge = excessDistance * ratePerMile;
  //     setDeliveryCharges({ charge: deliveryCharge.toFixed(2), ratePerMile });
  //   }
  // };

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

  console.log(showAddons);

  const handleDeleteItem = async (id, index) => {
    if (!id) return;
    setDeleteIndex(index);
    await deleteSingleCartItem(id, {
      onSuccess: async (res) => {
        await fetchCartList();
        console.log("Success response", res);
        toast.success("Item removed from your cart");
      },
      onFailed: (err) => {
        console.log("Error on delete cart item", err);
        toast.error("Delete cart item failed!");
      },
    });
  };

  const handleDelivery = async () => {
    if (deliveryOption === "delivery") {
      if (!postalcode || postalcode.length == 0) {
        setError(true);
        return;
      }
      fetchDistanceData();

      const postCodeValidation = handleAddress();

      sessionStorage.setItem("postcode", postalcode);
      sessionStorage.setItem("type", deliveryOption);
      sessionStorage.setItem("distance ", distanceRange);

      if (postCodeValidation === false) return;
    }
  };

  return (
    <div>
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
                          <strong>{item?.productName ?? "N/A"}</strong>
                        </p>
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
                        {/* <div className="inc_dec_wrapper_order_summary">
                          <button
                            className="summary_qty_btn dec_btn_order_summary"
                            onClick={() => handleDecreaseOrderSummary(index)}
                          >
                            -
                          </button>
                          <span>{orderCounts[index]}</span>
                          <button
                            className="summary_qty_btn inc_btn_order_summary"
                            onClick={() => handleIncreaseOrderSummary(index)}
                          >
                            +
                          </button>
                        </div> */}
                        {(addOns && addOns.length != 0) ||
                        (masterAddons && masterAddons.length != 0) ? (
                          <button
                            className="summary_addons_collapse_btn"
                            onClick={() => toggleFoodLists(index)}
                          >
                            {showAddons && showAddons.includes(index) ? (
                              <Fragment>
                                <Io.IoIosArrowRoundUp />{" "}
                                <span>Know less</span>
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
              {deliveryOption === "takeaway" ? (
                <Fragment>
                  <tr className="discount_order_summary">
                    <td>Discount</td>
                    <td>{takeaway}</td>
                  </tr>
                  <tr>
                    <td>Total Cost</td>
                    <td>£{takeawayTotal ?? "N/A"}</td>
                  </tr>
                </Fragment>
              ) : (
                <Fragment>
                  <tr className="discount_order_summary">
                    <td>Discount</td>
                    <td>{discount}</td>
                  </tr>
                  <tr>
                    <td>Total Cost</td>
                    <td>£{allTotal ?? "N/A"}</td>
                  </tr>
                </Fragment>
              )}
            </table>
          </div>
        ) : (
          <h3 className="empty_indic_order_summary">No items added yet!</h3>
        )}
      </div>

      <br />
      <div className="line__"></div>
      <div className="d-flex mt-4">
        <label htmlFor="delivery" className="delivery_option_container">
          <input
            type="radio"
            name="deliveryOption"
            id="delivery"
            className="delivery_option"
            checked={deliveryOption === "delivery"}
            onClick={() => setDeliveryOption("delivery")}
          />
          <span class="checkmark"></span>
          Delivery
        </label>
        <label htmlFor="takeAway" className="delivery_option_container">
          <input
            type="radio"
            name="deliveryOption"
            id="takeAway"
            className="ms-3 delivery_option"
            onClick={() => setDeliveryOption("takeaway")}
            checked={deliveryOption === "takeaway"}
          />
          <span class="checkmark"></span>
          Take away
        </label>
      </div>
      {deliveryOption === "delivery" ? (
        <Fragment>
          <label htmlFor="" className="opt_label_827">
            Postal Code
          </label>
          <div className="inp_wrapper_827">
            <input
              type="text"
              name=""
              id=""
              className={
                error && postalcode.length == 0
                  ? "opt_input_827 err__"
                  : "opt_input_827"
              }
              placeholder="Please enter postal code!"
              value={postalcode}
              onChange={(e) => setPostalcode(e.target.value)}
            />
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <label htmlFor="" className="opt_label_827">
            Picup Time
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
              value={takeawayTime}
              onChange={(e) => setTakeawayTime(e.target.value)}
            />
          </div>
        </Fragment>
      )}
      {(error && postalcode.length == 0) ||
      (error && takeawayTime.length == 0) ? (
        <span className="err_msg_order_summary">
          *Please fill required fields!
        </span>
      ) : (
        ""
      )}
      <button
        type="button"
        className="order_now_192"
        onClick={handleDelivery}
        disabled={!cartItems || cartItems.cartItems.length == 0}
      >
        Order Now
      </button>
    </div>
  );
}

export default OrderSummary;
