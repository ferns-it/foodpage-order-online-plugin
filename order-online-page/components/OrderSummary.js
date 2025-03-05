import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Fa from "react-icons/fa";
import * as Io from "react-icons/io";
import * as Tb from "react-icons/tb";
import { toast, Toaster } from "react-hot-toast";
import DeliveryBike from "../assets/DeliveryScooter.png";
import Shop from "../assets/NewStore.png";
import { AppContext } from "../context";
import { useRouter } from "next/navigation";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from "../../_utils/ClientUtils";
import { BsFillBasket2Fill } from "react-icons/bs";
import Image from "next/image";

function OrderSummary() {
  const router = useRouter();

  const {
    cartItems,
    deleteSingleCartItem,
    cartLoading,
    fetchCartList,
    settings,
    clearCartItems,
    delivery,
    setDelivery,
    deliveryInfo,
    GuestDiscountoftakeaway,
    shopId,
    updateCart,
    GuestDeliveryDetails,
  } = useContext(AppContext);

  const [showAddons, setShowAddons] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [updatedIndex, setUpdatedIndex] = useState(-1);
  const [takeawayTime, setTakeawayTime] = useState(null);
  const [error, setError] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [time, setTime] = useState("");
  const [takeaway, setTakeaway] = useState(null);
  const [takeawayTotal, setTakeawayTotal] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  useEffect(() => {
    if (product) {
      setQuantity(product?.quantity ?? 1);
    } else {
      setQuantity(1);
    }
  }, [product]);

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
  const handleTakeaway = () => {
    setDelivery(true);
    removeSessionStorageItem("distance");
    removeSessionStorageItem("deliveryFee");
  };

  const updateQuantity = async (type, item, index) => {
    if (!item) {
      toast.error("Something went wrong, Please try again!");
      return;
    }

    setUpdatedIndex(index);
    setProduct(item);

    let newQuantity;
    if (type === "increase") {
      newQuantity = Number(item.quantity) + 1;
    } else {
      // For decrease
      newQuantity = Number(item.quantity) > 1 ? Number(item.quantity) - 1 : 1;
    }

    // Update UI immediately
    setQuantity(newQuantity);

    // Update cart in backend
    await handleUpdateCart(item, newQuantity);
  };
  const handleUpdateCart = async (product, newQuantity) => {
    try {
      if (newQuantity < 1) {
        toast.error("Please choose minimum quantity!");
        return;
      }

      setUpdateLoading(true);
      const cartId = product?.cartID;
      let userIdd;

      const token = getLocalStorageItem("token");
      const userId = getLocalStorageItem("UserPersistent");

      userIdd = token && token.length != 0 ? token : userId;

      if (!userIdd || (userIdd && userIdd.length == 0)) {
        toast.error("User unauthorized!");
        return;
      }

      const parsedCOptions = product?.cOption
        ? JSON.stringify(product?.cOption)
        : "";

      const payload = {
        pID: product.pID,
        rID: process.env.SHOP_ID,
        qty: newQuantity,
        cOption: parsedCOptions,
      };

      const headers = {
        user: userIdd,
      };

      await updateCart(cartId, payload, {
        onSuccess: async (data) => {
          toast.success("Cart updated successfully!");
          await fetchCartList(userId);
          setProduct(null);
          setQuantity(1);
        },
        onFailed: (err) => {
          toast.error(err.message || "Something went wrong!");
          console.error(err);
          setUpdateLoading(false);
          setProduct(null);
        },
        headers,
      });
    } finally {
      setUpdateLoading(false);
      setProduct(null);
    }
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
              router.replace(pathname);
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
  const handleDelivery = () => {
    setTime(null);
    setTakeawayTime(null);
    setDelivery(false);
    removeSessionStorageItem("guest");
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
                router.replace(pathname);
              }, 200);
            }
            return;
          }
          toast.error(res?.data?.errorMessage?.message);
        },
        onFailed: (err) => {
          toast.error(err?.response?.data?.errorMessage?.message);
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
    setSessionStorageItem("path", "checkout");
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
  const clearcart = async () => {
    const userID = getLocalStorageItem("UserPersistent");

    await clearCartItems(userID, {
      onSuccess: async (res) => {
        toast.success("Cart Cleared!");
        await fetchCartList(userID);
      },
      onFailed: (err) => {
        toast.err("Something Went Wrong!");
      },
    });
  };

  return (
    <Fragment>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="summary-sec" style={{ width: "100%" }}>
        <div className="head-summary">
          <div className="bsket">
            <BsFillBasket2Fill size={24} />
            <small> My Basket</small>
          </div>
          {cartLoading ? (
            <button disabled className="clr_cart_btn col-md-6">
              ..
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
        </div>

        <div className="summary_item_wrapper_029">
          {cartItems && cartItems.cartItems.length != 0 ? (
            <div className="summary_card card">
              {cartItems &&
                cartItems.cartItems.map((item, mainIndex) => {
                  const addOns = item?.addon_apllied;
                  const masterAddons = item?.master_addon_apllied;
                  return (
                    <>
                      <div
                        className="position-relative mb-4"
                        key={item.cartID || mainIndex}
                      >
                        <div className="d-flex">
                          <p className="food_menu m-0 food_title_299">
                            <div className="round-qty">{item?.quantity}</div>{" "}
                            <div className="strong-name">
                              {item?.productName ?? "N/A"} <br />
                              {item?.product_total_price}
                            </div>
                          </p>

                          <p className="price_summary_1">
                            {/* {item?.product_total_price} */}
                            <button
                              type="button"
                              className="remove"
                              onClick={() =>
                                handleDeleteItem(item?.cartID, mainIndex)
                              }
                              disabled={
                                cartLoading && deleteIndex === mainIndex
                              }
                            >
                              {cartLoading && deleteIndex === mainIndex ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <Fa.FaRegTrashAlt />
                              )}
                            </button>
                          </p>
                        </div>
                        <div className="cart-info">
                          {" "}
                          {(addOns && addOns.length != 0) ||
                          (masterAddons && masterAddons.length != 0) ? (
                            <button
                              className="summary_addons_collapse_btn"
                              onClick={() => toggleFoodLists(mainIndex)}
                            >
                              {showAddons && showAddons.includes(mainIndex) ? (
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
                          {updateLoading && cartLoading ? (
                            <></>
                          ) : (
                            <div className="button-second">
                              <div className="d-flex cover-btn">
                                <button
                                  onClick={() =>
                                    updateQuantity("decrease", item, mainIndex)
                                  }
                                  disabled={item.quantity <= 1 || updateLoading}
                                  className="cart_qty_btns inc_btn"
                                >
                                  -
                                </button>

                                {updatedIndex ? (
                                  <span className="px-3 f-16">
                                    {item.quantity}
                                  </span>
                                ) : (
                                  <span className="px-3 f-16">
                                    {product == null ? item.quantity : quantity}
                                  </span>
                                )}

                                <button
                                  className="cart_qty_btns inc_btn"
                                  onClick={() =>
                                    updateQuantity("increase", item, mainIndex)
                                  }
                                  disabled={cartLoading}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className={`add_ons_wrapper_order_summary ${
                            showAddons && showAddons.includes(mainIndex)
                              ? "show"
                              : ""
                          }`}
                        >
                          <table className="addOnsList028">
                            {addOns &&
                              addOns.length != 0 &&
                              addOns.map((add, addsOnindex) => {
                                return (
                                  <>
                                    <tbody>
                                      <span key={addsOnindex}>
                                        <strong className="ad-title">
                                          {add?.title}
                                        </strong>
                                      </span>

                                      {add &&
                                        add.choosedOption.length != 0 &&
                                        add.choosedOption.map(
                                          (data, chooseIndex) => {
                                            return (
                                              <tr key={chooseIndex}>
                                                <td>{data?.text}</td>
                                                <td>{data?.price}</td>
                                              </tr>
                                            );
                                          }
                                        )}
                                    </tbody>
                                  </>
                                );
                              })}
                          </table>
                          <table className="addOnsList028">
                            {masterAddons &&
                              masterAddons.length != 0 &&
                              masterAddons.map((add, masterAddindex) => {
                                return (
                                  <>
                                    <tbody>
                                      <span key={masterAddindex}>
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
                                    </tbody>
                                  </>
                                );
                              })}
                          </table>
                        </div>
                      </div>
                    </>
                  );
                })}
              <hr className="mt-0" />
              <table className="total_cost_summary">
                {delivery == true || delivery == "true" ? (
                  <>
                    <Fragment>
                      <tbody>
                        <tr className="discount_order_summary">
                          <td>
                            <h4>
                              {" "}
                              <b>Cart total</b>
                            </h4>
                          </td>
                          <td>
                            <b>{cartItems?.cartTotal?.cartTotalPriceDisplay}</b>
                          </td>
                        </tr>
                      </tbody>
                      {/* <tr className="discount_order_summary">
                      <td>Discount</td>
                      <td>-£{takeaway}</td>
                    </tr> */}
                      {/* <tr>
                      <td>Total Cost</td>
                      <td>£{takeawayTotal ?? "N/A"}</td>
                    </tr> */}
                    </Fragment>
                  </>
                ) : (
                  <>
                    <Fragment>
                      <tbody>
                        {" "}
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
                      </tbody>

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
            <div className="row mt-3 mx-auto d-flex">
              {/* Delivery Option */}
              <div
                className={`col-md-6 option-card  ${
                  !delivery ? "selected" : ""
                }`}
                onClick={handleDelivery}
              >
                <div className="card mx-auto text-center">
                  <div className="mx-auto text-center">
                    <Image
                      src={DeliveryBike}
                      width={50}
                      height={0}
                      alt="Delivery"
                      className={`option-icon ${
                        !delivery ? "active-icon" : ""
                      }`}
                    />{" "}
                    <p
                      className={delivery ? "selected-text" : "unselected-text"}
                    >
                      Delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Takeaway Option */}
              {deliveryInfo?.takeAway == 1 &&
                deliveryInfo?.takeAway_temp_off === "No" && (
                  <div
                    className={`col-md-6 option-card ${
                      delivery ? "selected" : ""
                    }`}
                    onClick={handleTakeaway}
                  >
                    <div className="card p-3 mx-auto text-center">
                      <div className="mx-auto text-center">
                        {" "}
                        <Image
                          src={Shop}
                          width={50}
                          height={0}
                          alt="Takeaway"
                          className={`option-icon ${
                            delivery ? "active-icon" : ""
                          }`}
                        />{" "}
                        <p
                          className={
                            !delivery ? "selected-text" : "unselected-text"
                          }
                        >
                          Take Away
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div className="row">
              {delivery == false &&
              deliveryInfo?.homeDelivery_temp_off === "No" ? (
                <div
                  style={{ width: "90%", padding: "10px", margin: "0px auto" }}
                >
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
                  {error && (
                    <div className="error-message messasge-card">{error}</div>
                  )}
                  <div className="messasge-card">
                    <small className="messasge-card">
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

            <h6 className="text-center messasge-card mb-4">
              Minimum Amount for Card payment is £
              {settings?.deliveryInfo?.onlinePaymentMinAmount}
            </h6>
            <div className="mx-auto text-center">
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
                <i className="icon-next">
                  <Fa.FaArrowAltCircleRight />
                </i>
                {!locationLoading ? (
                  "Order Now"
                ) : (
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                  ></div>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
}

export default OrderSummary;
