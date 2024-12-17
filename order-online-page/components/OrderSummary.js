"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Fa from "react-icons/fa";
import * as Io from "react-icons/io";
import Utils from "../utils/Utils";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AppContext } from "../context";
import { useRouter } from "next/navigation";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from "../../_utils/ClientUtils";
import { TableReservationContext } from "../../table-reservation/context/TableReservationContext";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function OrderSummary() {
  const router = useRouter();
  const params = useParams();
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
    // setisCheckoutActive,
    deliveryInfo,
    GuestDiscountoftakeaway,
    shopId,
    GuestDeliveryDetails,
    clearCartItems,
  } = useContext(AppContext);
  const { shopTiming } = useContext(TableReservationContext);

  const [showAddons, setShowAddons] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [locationData, setLocationData] = useState(null);
  const [takeawayTime, setTakeawayTime] = useState(null);
  const [error, setError] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [convertedDistance, setConvertedDistance] = useState(null);
  const [time, setTime] = useState("");
  const [takeaway, setTakeaway] = useState(null);
  const [response, setResponse] = useState(null);
  const [takeawayTotal, setTakeawayTotal] = useState(null);
  const [postcodeData, setPostcodeData] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [timeIntervals, setTimeIntervals] = useState(null);

  useEffect(() => {
    const value = cartItems?.cartTotal?.cartTotalPrice;
    const subtotal = value && value / 100;
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

    // setTakeaway(takeawayDiscount.toFixed(2));
    setAllTotal((subtotal - homeDeliveryDiscount).toFixed(2));
    setTakeawayTotal((subtotal - takeawayDiscount).toFixed(2));

    // if (cartItems && deliveryInfo) {
    //   calculateDiscounts();
    // }
  }, [cartItems, deliveryInfo]);

  useEffect(() => {
    if (!shopTiming) return;

    if (!shopTiming || shopTiming.length === 0) {
      setTimeIntervals([]);
      return;
    }

    const timing = shopTiming?.shopTiming;
    const today = new Date().getDay();
    const dayValue = days[today];
    const todaysTiming = timing[dayValue];
    const now = new Date();

    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const findIntervals = todaysTiming
      .filter((time) => time?.status === "active")
      .flatMap((time) =>
        Utils.get15MinuteIntervals(time.openingTime, time.closingTime)
      )
      .filter((interval) => {
        const [hour, minute] = interval.split(":").map(Number);

        // Compare each interval time to the current time
        return (
          hour > currentHours ||
          (hour === currentHours && minute > currentMinutes)
        );
      });

    setTimeIntervals(findIntervals);
  }, [shopTiming]);

  const handleTakeaway = () => {
    setDelivery(true);
    removeSessionStorageItem("distance");
    removeSessionStorageItem("deliveryFee");
  };
  const processLocationData = (locationData) => {
    if (!locationData) return;
    const mileToKMConversionFactor = 0.62137119;
    const distanceText = locationData?.distance?.text;

    if (!distanceText) {
      return "Data Unavailable";
    }

    const numericDistanceKM = parseFloat(distanceText.match(/[\d\.]+/)[0]);
    if (isNaN(numericDistanceKM)) {
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
    if (deliveryInfo?.fixedDeliveryCharge == "byDistance") {
      sessionStorage.setItem("newdis", actualDistance);
    }

    setConvertedDistance(actualDistance);
    return actualDistance;
  };

  const handleDelivery = () => {
    setTime(null);
    setTakeawayTime(null);
    setDelivery(false);
    removeSessionStorageItem("guest");
  };

  const calculateTakwawayDiscount = async () => {
    try {
      setLocationLoading(true);
      const userID = getLocalStorageItem("UserPersistent");
      let headers = {
        user: userID,
        "x-secretkey": process.env.FOODPAGE_SECRET_KEY,
      };
      const payload = {
        shopID: settings?.deliveryInfo?.shopId ?? shopId,
        pickupTime: time,
      };

      await GuestDiscountoftakeaway(payload, {
        headers: headers,
        onSuccess: async (res) => {
          if (res?.data?.error == false) {
            toast.success("Continue to checkout", { icon: "👍🏻" });
            const deliveryResp = res.data.data;
            setTakeaway(res?.data?.discountAmount);
            sessionStorage.setItem("type", delivery);
            sessionStorage.setItem("discount", takeaway);
            sessionStorage.setItem("takeawaytime", takeawayTime);
            sessionStorage.setItem("location", "checkout");
            const pathname = `/checkout?price=${deliveryResp?.cart_NetAmount}&&deliveryCharge=0&&discount=${deliveryResp?.discountAmount}`;
            setLocalStorageItem("path", pathname);
            setTimeout(() => {
              router.push(pathname);
            }, 200);
            setSessionStorageItem(
              "deliveryResponse",
              JSON.stringify(deliveryResp)
            );
          } else {
            let errMsg =
              res?.data?.errorMessage?.reason.message ?? "Invalid time";

            toast.error(errMsg);
          }
        },
        onFailed: (err) => {
          toast.error(err?.response?.data?.errorMessage?.reason?.message);
        },
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const clearcart = async () => {
    const userID = getLocalStorageItem("UserPersistent");
    console.log(userID, "useridsdas");
    await clearCartItems(userID, {
      onSuccess: async (res) => {
        console.log("cart cleared", res);
        toast.success("Cart Cleared!");
        await fetchCartList(userID);
      },
      onFailed: (err) => {
        console.log("Error on cart clear", err);
        toast.err("Something Went Wrong!");
      },
    });
  };

  const calculateDeliveryDetails = async () => {
    try {
      setLocationLoading(true);
      const userID = getLocalStorageItem("UserPersistent");
      let headers = {
        user: userID,
        "x-secretkey": process.env.FOODPAGE_SECRET_KEY,
      };
      const payload = {
        shopID: settings?.deliveryInfo?.shopId ?? shopId,
        postCode: postalCode,
      };

      await GuestDeliveryDetails(payload, {
        headers: headers,
        onSuccess: async (res) => {
          console.log(res, ":respones");
          if (res?.data?.error == false) {
            const deliveryResp = res.data.data;
            if (deliveryResp) {
              setSessionStorageItem(
                "deliveryResponse",
                JSON.stringify(deliveryResp)
              );
              toast.success("Continue to checkout", { icon: "👍🏻" });
              sessionStorage.setItem("location", "/checkout");
              sessionStorage.setItem("postcode", postalCode);
              sessionStorage.setItem("type", delivery);
              sessionStorage.setItem(
                "discount",
                res?.data?.data?.discountAmount
              );
              sessionStorage.setItem("isCheckoutActive", true);
              const pathname = `/checkout?price=${deliveryResp?.cart_NetAmount}&&deliveryCharge=${deliveryResp?.deliveryFeeAmount}&&discount=${deliveryResp?.discountAmount}`;
              setLocalStorageItem("path", pathname);
              setTimeout(() => {
                router.push(pathname);
              }, 200);
            }
            return;
          }
          toast.error(res?.data?.errorMessage?.message);
        },
        onFailed: (err) => {
          const errMsg =
            err?.response?.data?.errorMessage?.message ?? "Invalid postal code";
          // console.log("errMsg", err?.response?.data?.errorMessage.message);

          // toast.error(err?.response?.data?.errorMessage?.message);
          toast.error(errMsg);
        },
      });
    } finally {
      setLocationLoading(false);
    }
  };
  const handleAddress = async () => {
    if (cartItems?.cartItems?.length === 0) {
      toast("Your cart is empty!");
      return;
    }

    if (delivery == false || delivery == "false") {
      if (postalCode == "" || postalCode == null) {
        toast.error("Please add Details of Delivery!");
        sessionStorage.setItem("isCheckoutActive", false);
        return;
      }

      await calculateDeliveryDetails();
      return;
    }

    if (delivery == true || delivery == "true") {
      if (time === null || time.length == 0) {
        toast.error("Please Choose Takeaway Time!");
        return;
      }

      await calculateTakwawayDiscount();
    }
  };

  const handlePostalCode = (e) => {
    const { value } = e.target;
    let postalCode = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    setPostalCode(postalCode);
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
        const userId = getSessionStorageItem("UserPersistent");
        await fetchCartList(userId);
        toast.success("Item removed from your cart");
      },
      onFailed: (err) => {
        toast.error("Delete cart item failed!");
      },
    });
  };

  const validateCurrentTime = (event) => {
    const inputValue = event.target.value;
    if (!inputValue) {
      toast.error("Time input is null or empty");
      return;
    }

    const [hours, minutes] = inputValue.split(":");
    const takeawayTimeData = new Date();

    takeawayTimeData.setHours(parseInt(hours, 10));
    takeawayTimeData.setMinutes(parseInt(minutes, 10));

    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const second = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };

    const formattedTime = formatDateTime(takeawayTimeData);

    setTime(formattedTime);
    setTakeawayTime(formattedTime);
  };
  console.log(shopTiming, "shopTiming");
  return (
    <Fragment>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-100 position-relative">
        <h3 className="order_title text-center">Order Summary</h3>
        {cartLoading ? (
          <button disabled className="clr_cart_btn col-md-6">
            Submitting..
          </button>
        ) : (
          <button
            type="button"
            className="clr_cart_btn col-md-6"
            onClick={clearcart}
          >
            Clear Cart
          </button>
        )}
        <div className="summary_item_wrapper_029">
          {cartItems && cartItems.cartItems.length != 0 ? (
            <div className="summary_card card">
              {cartItems &&
                cartItems.cartItems.map((item, index) => {
                  const addOns = item?.addon_apllied;
                  const masterAddons = item?.master_addon_apllied;
                  return (
                    <Fragment key={index}>
                      <div className="position-relative mb-4">
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
                            showAddons && showAddons.includes(index)
                              ? "show"
                              : ""
                          }`}
                        >
                          <div className="addOnsList028">
                            <>
                              {addOns &&
                                addOns.length != 0 &&
                                addOns.map((add, aindex) => {
                                  return (
                                    <Fragment key={aindex}>
                                      <span>
                                        <strong>{add?.title}</strong>
                                      </span>
                                      <table>
                                        <tbody>
                                          {add &&
                                            add.choosedOption.length != 0 &&
                                            add.choosedOption.map(
                                              (data, addindex) => {
                                                return (
                                                  <tr key={addindex}>
                                                    <td>{data?.text}</td>
                                                    <td>{data?.price}</td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                        </tbody>
                                      </table>
                                    </Fragment>
                                  );
                                })}
                            </>
                          </div>
                          <div className="addOnsList028">
                            <Fragment>
                              {masterAddons &&
                                masterAddons.length != 0 &&
                                masterAddons.map((add, masterindex) => {
                                  return (
                                    <Fragment key={masterindex}>
                                      <span>
                                        <strong>{add?.title}</strong>
                                      </span>
                                      <table>
                                        <tbody>
                                          {add &&
                                            add.choosedOption.length != 0 &&
                                            add.choosedOption.map(
                                              (data, kindex) => {
                                                return (
                                                  <tr key={kindex}>
                                                    <td>{data?.text}</td>
                                                    <td>{data?.price}</td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                        </tbody>
                                      </table>
                                    </Fragment>
                                  );
                                })}
                            </Fragment>
                          </div>
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
                            onClick={() =>
                              handleDeleteItem(item?.cartID, index)
                            }
                            disabled={cartLoading && deleteIndex === index}
                          >
                            {cartLoading && deleteIndex === index ? (
                              <span
                                className="spinner-border spinner-border-sm"
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
                <tbody>
                  {delivery == true || delivery == "true" ? (
                    <Fragment>
                      <tr className="discount_order_summary">
                        <td>
                          <b>Cart total</b>
                        </td>
                        <td>
                          <b>{cartItems?.cartTotal?.cartTotalPriceDisplay}</b>
                        </td>
                      </tr>
                      {/* <tr className="discount_order_summary">
                      <td>Discount</td>
                      <td>-£{takeaway}</td>
                    </tr> */}
                      {/* <tr>
                      <td>Total Cost</td>
                      <td>£{takeawayTotal ?? "N/A"}</td>
                    </tr> */}
                    </Fragment>
                  ) : (
                    <>
                      <Fragment>
                        <tr className="discount_order_summary">
                          <td>
                            <b>Cart total</b>
                          </td>
                          <td id="sub_total_amt_order_summary">
                            <b>
                              {" "}
                              {cartItems?.cartTotal?.cartTotalPriceDisplay}
                            </b>
                          </td>
                        </tr>
                        {/* <tr className="discount_order_summary">
                      <td>Discount</td>
                      <td>-£ {discount}</td>
                    </tr> */}
                        {/* <tr>
                      <td>Total Cost</td>
                      <td>£ {allTotal ?? "N/A"}</td>
                    </tr> */}
                      </Fragment>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <h3 className="empty_indic_order_summary">No items added yet!</h3>
          )}
        </div>

        <br />
        <div className="line__"></div>
        {settings?.shopStatus == "open" && (
          <>
            <div
              className="row mt-3 mx-auto mx-auto"
              style={{ display: "flex" }}
            >
              <div className="col-md-6" style={{ flex: 1, fontSize: "15px" }}>
                <label>
                  <input
                    type="radio"
                    className="radio_btn"
                    checked={!delivery}
                    onChange={handleDelivery}
                  />
                  Delivery
                </label>
              </div>

              {deliveryInfo?.takeAway == 1 &&
                deliveryInfo?.takeAway_temp_off === "No" && (
                  <div
                    className="col-md-6"
                    style={{ flex: 1, fontSize: "15px" }}
                  >
                    <label>
                      <input
                        type="radio"
                        className="radio_btn"
                        checked={delivery}
                        onChange={handleTakeaway}
                      />{" "}
                      Takeaway
                    </label>
                  </div>
                )}
            </div>

            <div className="row">
              {delivery == false &&
              deliveryInfo?.homeDelivery_temp_off === "No" ? (
                <div style={{ width: "100%", padding: "10px" }}>
                  <label htmlFor="" className="opt_label_827">
                    Postal Code
                  </label>
                  <div className="inp_wrapper_827">
                    <input
                      type="text"
                      name="postalcode"
                      id=""
                      className="opt_input_827 uppercase"
                      placeholder="Please enter postal code!"
                      onChange={handlePostalCode}
                      value={postalCode}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ width: "100%", padding: "10px" }}>
                  <label htmlFor="takeaway-time" className="opt_label_827">
                    Pickup Time
                  </label>
                  <div className="inp_wrapper_827">
                    {/* <input
                      type="time"
                      name=""
                      id=""
                      className={
                        error && takeawayTime.length == 0
                          ? "opt_input_827 err__"
                          : "opt_input_827"
                      }
                      onChange={validateCurrentTime}
                    /> */}
                    <select
                      name=""
                      id=""
                      onChange={validateCurrentTime}
                      className="form-control form-select"
                    >
                      <option value="0" selected disabled>
                        Choose Takeaway time
                      </option>
                      {timeIntervals &&
                        timeIntervals.length != 0 &&
                        timeIntervals.map((interval, idx) => {
                          return (
                            <option value={interval}>
                              {Utils.convertTiming(interval)}
                            </option>
                          );
                        })}
                    </select>
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
            {deliveryInfo?.homeDelivery_temp_off == "Yes" && (
              <p
                style={{
                  fontSize: "10px",
                  color: "Red",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                Home Delivery Temporarily Blocked!
              </p>
            )}
            {deliveryInfo?.takeAway_temp_off == "Yes" && (
              <p
                style={{
                  fontSize: "10px",
                  color: "Red",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                Takeaway Temporarily Blocked!
              </p>
            )}
            {(error && postalCode.length == 0) ||
            (error && takeawayTime.length == 0) ? (
              <span className="err_msg_order_summary">
                * Please fill required fields!
              </span>
            ) : (
              ""
            )}

            <h6
              style={{ color: "#da6d6d", fontSize: "10px", fontWeight: "500" }}
              className="text-center"
            >
              Minimum Amount for Card payment is £
              {settings?.deliveryInfo?.onlinePaymentMinAmount}
            </h6>
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
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                ></div>
              )}
            </button>
          </>
        )}
      </div>
    </Fragment>
  );
}

export default OrderSummary;
