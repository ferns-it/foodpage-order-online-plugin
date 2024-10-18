"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { PiKey } from "react-icons/pi";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
// import * as Bs from "react-icons/bs";

import toast from "react-hot-toast";
import { AppContext } from "../context";
import CheckoutSummaryComp from "./CheckoutSummaryComp";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentElementOrderOnline from "./StripePaymentElementOrderOnline";
import PleaseWait from "./PleaseWait";
import { FiArrowLeft } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  redirectToLocation,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
} from "@/src/app/_utils/ClientUtils";

function OrderSummaryCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderType = sessionStorage.getItem("type");
  const details = JSON.parse(getSessionStorageItem("deliveryResponse"));
  const [paramsValues, setParamsValues] = useState({
    price: 0,
    discount: 0,
    deliveryFee: 0,
  });
  const {
    delivery,
    // setisCheckoutActive,
    completeCheckout,
    activeCard,
    setActiveCard,
    deliveryFee,
    createPaymentIntent,
    paymentData,
    setStripeClientSecret,
    stripePaymentClientSecret,
    stripePromise,
    fetchCartList,
    options,
    amount,
    settings,
    loading,
    setPaymentData,
    paymentError,
    shopId,
    isUserLogged,
    cartItems,
    clearCartItems,
  } = useContext(AppContext);

  // const { fetchCartList } = useContext(AppContext);

  console.log("activeCard", activeCard);

  const [paymentOption, setPaymentOption] = useState("");
  const [addressDefault, setAddressDefault] = useState(null);
  // useEffect(() => {
  //   const storeDefaultAddressDetails = JSON.parse(getSessionStorageItem("defaultAddressDetails"))
  //   if (storeDefaultAddressDetails) {
  //     setAddressDefault(storeDefaultAddressDetails)
  //   }
  // }, [addressDefault])
  const savedAddress = JSON.parse(
    getSessionStorageItem("defaultAddressDetails")
  );
  // console.log(savedAddress, "saved");
  const [formState, setFormState] = useState({
    fullname:
      (isUserLogged != null &&
        isUserLogged?.payload?.data?.userFirstName +
          " " +
          isUserLogged?.payload?.data?.userLastName) ||
      "",
    postalCode: "",
    emailAddress:
      (isUserLogged != null && isUserLogged?.payload?.data?.userEmail) || "",
    phone:
      (isUserLogged != null && isUserLogged?.payload?.data?.userMobile) || "",
    addressLine1: (savedAddress != null && savedAddress?.line1) || "",
    addressLine2: (savedAddress != null && savedAddress?.line2) || "",
    townCity: (savedAddress != null && savedAddress?.town) || "",
    county: (savedAddress != null && savedAddress?.county) || "",
    notes: "",
  });

  const [fieldError, setFieldError] = useState(false);
  const [discountData, setDiscountData] = useState(null);
  const [intentLoading, setIntentLoading] = useState(false);

  useEffect(() => {
    const price = searchParams.get("price");
    const deliveryCharge = searchParams.get("deliveryCharge");
    const discount = searchParams.get("discount");

    setParamsValues({
      price,
      discount,
      deliveryFee: deliveryCharge,
    });
  }, [searchParams]);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();

  //     event.returnValue = "Are you sure you want to leave?";
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  useEffect(() => {
    if (delivery == false) {
      const postalCode = getSessionStorageItem("postcode");
      if (!postalCode) {
        toast.error("Postal code is undefined");
        return;
      }
      setFormState({ ...formState, postalCode });
    } else {
      // setActiveCard("payment");
      const postalCode =
        isUserLogged != null && isUserLogged?.payload?.data?.userPostCode;
      setFormState({ ...formState, postalCode });
    }
  }, [delivery]);

  // useEffect(() => {
  //   if (delivery === null) return;

  //   setActiveCard(!delivery ? "login" : "payment");
  // }, [delivery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleEmptyValidation = () => {
    const emptyFields = [];

    for (const key in formState) {
      if (Object.prototype.hasOwnProperty.call(formState, key)) {
        if (key === "addressLine2" || key === "notes") {
          continue;
        }

        if (
          typeof formState[key] !== "string" ||
          formState[key].trim() === ""
        ) {
          emptyFields.push(key);
        }
      }
    }

    return emptyFields.length > 0 ? emptyFields : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (settings?.shopStatus != "open") {
      toast.error("Shop is currently closed");
      return;
    }

    let deliveryTypeData;

    if (delivery == false || delivery == "false") {
      if (settings?.deliveryInfo?.homeDelivery_temp_off == "Yes") {
        toast.error("Home Delivery Currently Not available!");
      }

      deliveryTypeData = "Home Delivery";
      const isValid = handleEmptyValidation();
      console.log(isValid);

      if (isValid && isValid.length != 0) {
        setFieldError(true);
        return;
      }
      setActiveCard("payment");
    } else {
      if (settings?.deliveryInfo?.takeAway_temp_off == "Yes") {
        toast.error("Takeaway Currently Not available!");
        return;
      }
      setActiveCard("payment");
      deliveryTypeData = "Take Away";
    }
  };

  const createPaymentIntentRequest = async () => {
    const minAmountForCardPayment = parseFloat(
      settings?.deliveryInfo?.onlinePaymentMinAmount
    );
    const cartTotal =
      typeof details?.cart_NetAmount == "string"
        ? parseFloat(details?.cart_NetAmount)
        : details?.cart_NetAmount;

   
    if (cartTotal < minAmountForCardPayment) {
      toast.error(
        `Minimum amount for card payment is ${minAmountForCardPayment}, please choose another payment option!`
      );
    } 
    

    const discount = sessionStorage.getItem("discount");
    const fees = sessionStorage.getItem("delFee");
    const restId = sessionStorage.getItem("restaurantId");
    setDiscountData(discount);
    setPaymentOption("stripe");

    if (paymentData == null) {
      try {
        const userID = getLocalStorageItem("UserPersistent");
        let headers = {
          User: userID,
        };
        setIntentLoading(true);
        const discountam = Number(details?.discount ?? paramsValues.discount);
        const delivFeeAmt = deliveryFee ?? paramsValues?.deliveryFee;

        await createPaymentIntent(
          {
            devliveryCharges: (delivFeeAmt ?? 0) * 100,
            discountAmount: isNaN(discountam) ? 0 : parseInt(discountam * 100),
            shopID: shopId,
          },

          {
            headers: headers,
            onSuccess: (res) => {
              setPaymentData(res);
              const result = res?.data?.data?.paymentIntent?.client_secret;

              if (result != null) {
                setStripeClientSecret(result);
              }
            },

            onFailed: (error) => {
              toast.error(error?.message);
            },
          }
        );
      } finally {
        setIntentLoading(false);
      }
    }
  };

  const handlecashondelivery = () => {
    setPaymentOption("cash");
    setPaymentData(null);
  };
  const completeOrder = async () => {
    const data = paymentData?.data?.data;
    const discount = sessionStorage.getItem("discount");
    const details = JSON.parse(getSessionStorageItem("deliveryResponse"));
    const deliveryAmount = sessionStorage.getItem("deliveryFee");
    let deliveryType;

    if (delivery == false || delivery == "false") {
      deliveryType = "door_delivery";
    } else {
      deliveryType = "store_pickup";
    }
    const paymentMethod = paymentOption === "stripe" ? "STRIPE" : "COD";

    const userID = getLocalStorageItem("UserPersistent");
    const isGuest = getLocalStorageItem("guest");
    const userToken = getLocalStorageItem("userToken");

    if (
      (paymentMethod === "STRIPE" && paymentData != null) ||
      (paymentMethod === "COD" && paymentData === null)
    ) {
      const priceValue = details
        ? details?.cart_NetAmount
        : paramsValues?.price;
      const discountValue = details
        ? details?.discountAmount
        : paramsValues?.discount;
      const deliveryChargeValue = details
        ? details?.deliveryFeeAmount
        : paramsValues?.deliveryFee;

      //!payload here
      const payload = {
        shopID: data?.shopID != null ? data?.shopID : shopId,
        discount: discountValue,
        amount: priceValue * 100,
        deliveryType: deliveryType,
        deliveryCharge:
          deliveryType === "store_pickup" ? 0 : deliveryChargeValue,
        // couponCode: "",
        // couponType: "",
        // couponValue: "",
        // couponAmount: "",
        paymentStatus: paymentMethod === "COD" ? 0 : 1,
        paymentGatway: paymentMethod,
        transactionID: paymentMethod === "COD" ? "" : data?.paymentIntent?.id,
        approxDeliveryTime:
          deliveryType === "store_pickup"
            ? settings?.deliveryInfo?.minWaitingTime
            : "",
        deliveryNotes: formState?.notes,
        deliveryLocation: formState?.postalCode,
        takeawayTime:
          deliveryType === "store_pickup"
            ? sessionStorage.getItem("takeawaytime")
            : "",
        customer: {
          customerName: formState?.fullname,
          line1: formState?.addressLine1,
          line2: formState?.addressLine2,
          town: formState?.townCity,
          postcode: formState?.postalCode,
          county: formState?.county,
          landmark: "",
          email: formState?.emailAddress,
          phone: formState?.phone,
        },
        source: "NextJs",
      };

      // let headers = {
      //   User: userToken ? userToken : userID,
      // };

      let headers = {
        User: userID,
      };

      await completeCheckout(payload, {
        headers: headers,
        onSuccess: async (res) => {
          toast.success("Order Confirmed!");
          //! user token removed here
          // removeLocalStorageItem("userToken");
          // removeSessionStorageItem("userInfo");

          await fetchCartList(userID);
          await clearCartItems(userID, {
            onSuccess: (res) => {
              console.log("cart cleared", res);
            },
            onFailed: (err) => {
              console.log("Error on cart clear", err);
            },
          });
          router.refresh();
          router.push("/order-online");
          setActiveCard("login");
          setPaymentData(null);
        },
        onFailed: (err) => {
          console.log("error message for confirm payment", err);
          toast.error(err.message);
        },
      });
    }
  };

  const handleToggle = () => {
    setActiveCard("login");
  };

  return (
    <Fragment>
      <section className="order_summary_checkout">
        {/* <button type="button" onClick={completeOrder}>
          click
        </button> */}
        <div className="container">
          <button
            className="back_btn_order_online_828"
            onClick={() => router.push("/order-online")}
          >
            <FiArrowLeft />
          </button>
          <div className="sm_summary">
            <CheckoutSummaryComp />
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-12 col-sm-12 position-relative">
              <div className="card login_summary_card_0928">
                <div className="login_summary_card_ico_0928">
                  <PiKey />
                </div>
                {orderType == false || orderType == "false" ? (
                  <h4>Delivery Address</h4>
                ) : (
                  <h4>Billing Address</h4>
                )}
                {activeCard === "login" ? (
                  <p>To proceed with your order, please register with us!</p>
                ) : (
                  <div className="d-flex">
                    <p>Complete your payment</p>
                    <button
                      className="edit_btn_details"
                      type="button"
                      onClick={handleToggle}
                    >
                      <i>
                        <HiOutlinePencilSquare />
                      </i>
                    </button>
                  </div>
                )}

                <div
                  className={
                    activeCard == "login"
                      ? "login_order_online_form_0283 "
                      : "login_order_online_form_0283 hide"
                  }
                  // className="login_order_online_form_0283"
                >
                  <p id="sub_summary_txt">Enter your details</p>
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="row">
                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="fullname"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullname"
                            id=""
                            className={
                              fieldError === true &&
                              (!formState.fullname ||
                                formState.fullname.length === 0)
                                ? "form-control online_order_plugin_input_2939 error___"
                                : "form-control online_order_plugin_input_2939 "
                            }
                            onChange={handleChange}
                            value={formState.fullname}
                          />
                        </div>
                        {fieldError === true &&
                          (!formState.fullname ||
                            formState.fullname.length === 0) && (
                            <span className="oos_err_29102">
                              Name is required!
                            </span>
                          )}
                      </div>

                      <>
                        <div className="col-lg-4 col-md-4 col-sm-4">
                          <div className="form-group">
                            <label
                              htmlFor="postalCode"
                              className="form-label online_order_plugin_label_2939"
                            >
                              Postal Code
                            </label>
                            {orderType == true || orderType == "true" ? (
                              <input
                                type="text"
                                name="postalCode"
                                id=""
                                className={
                                  fieldError == true &&
                                  (!formState.postalCode ||
                                    formState?.postalCode.length === 0)
                                    ? "form-control online_order_plugin_input_2939 error___"
                                    : "form-control online_order_plugin_input_2939 "
                                }
                                style={{ textTransform: "uppercase" }}
                                onChange={handleChange}
                                // value={formState?.postalCode ?? ""}
                              />
                            ) : (
                              <input
                                className="form-control online_order_plugin_input_2939"
                                type="text"
                                name="postalCode"
                                id=""
                                value={
                                  details?.generalData?.destinationPostCode
                                }
                                disabled
                              />
                            )}
                            {/* <input
                                type="text"
                                name="postalCode"
                                id=""
                                className={
                                  fieldError == true &&
                                  (!formState.postalCode ||
                                    formState?.postalCode.length === 0)
                                    ? "form-control online_order_plugin_input_2939 error___"
                                    : "form-control online_order_plugin_input_2939 "
                                }
                                style={{ textTransform: "uppercase" }}
                                onChange={handleChange}
                                value={formState.postalCode}
                                // disabled={
                                //   delivery !== false || delivery !== "false"
                                //     ? true
                                //     : false
                                // }
                              /> */}
                          </div>
                          {fieldError == true &&
                            (!formState.postalCode ||
                              formState?.postalCode?.length === 0) && (
                              <span className="oos_err_29102">
                                Postal code is required!
                              </span>
                            )}
                        </div>
                      </>

                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="emailAddress"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Email Address
                          </label>
                          <input
                            type="text"
                            name="emailAddress"
                            id=""
                            className={
                              fieldError &&
                              (!formState.emailAddress ||
                                formState?.emailAddress.length === 0)
                                ? "form-control online_order_plugin_input_2939 error___"
                                : "form-control online_order_plugin_input_2939 "
                            }
                            onChange={handleChange}
                            value={formState.emailAddress}
                          />
                        </div>
                        {fieldError &&
                          (!formState.emailAddress ||
                            formState?.emailAddress?.length === 0) && (
                            <span className="oos_err_29102">
                              Email Address is required!
                            </span>
                          )}
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="email"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Phone number
                          </label>
                          <input
                            type="text"
                            name="phone"
                            id=""
                            className={
                              fieldError &&
                              (!formState.phone ||
                                formState?.phone.length === 0)
                                ? "form-control online_order_plugin_input_2939 error___"
                                : "form-control online_order_plugin_input_2939 "
                            }
                            onChange={handleChange}
                            value={formState.phone}
                          />
                        </div>
                        {fieldError &&
                          (!formState.phone ||
                            formState?.phone?.length === 0) && (
                            <span className="oos_err_29102">
                              Phone is required!
                            </span>
                          )}
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="addressLine1"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            name="addressLine1"
                            id=""
                            className={
                              fieldError &&
                              (!formState.addressLine1 ||
                                formState?.addressLine1.length == 0)
                                ? "form-control online_order_plugin_input_2939 error___"
                                : "form-control online_order_plugin_input_2939 "
                            }
                            onChange={handleChange}
                            value={formState.addressLine1}
                          />
                        </div>
                        {fieldError &&
                          (!formState.addressLine1 ||
                            formState?.addressLine1?.length == 0) && (
                            <span className="oos_err_29102">
                              Address Line 1 is required!
                            </span>
                          )}
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="addressLine2"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            name="addressLine2"
                            id=""
                            className={
                              "form-control online_order_plugin_input_2939"
                            }
                            onChange={handleChange}
                            value={formState.addressLine2}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="townCity"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Town/City
                          </label>
                          <input
                            type="text"
                            name="townCity"
                            id=""
                            className={
                              fieldError &&
                              (!formState.townCity ||
                                formState?.townCity.length == 0)
                                ? "form-control online_order_plugin_input_2939 error___"
                                : "form-control online_order_plugin_input_2939 "
                            }
                            onChange={handleChange}
                            value={formState.townCity}
                          />
                        </div>
                        {fieldError &&
                          (!formState.townCity ||
                            formState?.townCity?.length == 0) && (
                            <span className="oos_err_29102">
                              Town/City is required!
                            </span>
                          )}
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="county"
                            className="form-label online_order_plugin_label_2939"
                          >
                            County
                          </label>
                          <input
                            type="text"
                            name="county"
                            id=""
                            className="form-control online_order_plugin_input_2939"
                            onChange={handleChange}
                            value={formState.county}
                          />
                        </div>
                        {fieldError &&
                          (!formState.county ||
                            formState?.county?.length == 0) && (
                            <span className="oos_err_29102">
                              County Required
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="form-group mt-3">
                      <label
                        htmlFor="notes"
                        className="form-label online_order_plugin_label_2939"
                      >
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        id=""
                        className="form-control online_order_plugin_txtarea_2939"
                        onChange={handleChange}
                        value={formState.notes}
                      ></textarea>
                    </div>
                    {/* <br /> */}
                    <div className="form-group mt-3">
                      <button
                        type="submit"
                        className="online_order_plugin_login_btn"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                  {/* <button type="button" className="view_btn">View</button> */}
                </div>
              </div>
              <div
                className={
                  activeCard == "payment"
                    ? "order_online_horiz_line short"
                    : "order_online_horiz_line "
                }
              ></div>
              <div className="card login_summary_card_0928">
                <div className="login_summary_card_ico_0928">
                  <RiMoneyEuroCircleLine />
                </div>

                {cartItems?.paymentOptions != null &&
                cartItems?.paymentOptions.shopStatus != "closed" ? (
                  <>
                    {!intentLoading ? (
                      <Fragment>
                        <h4>Payment</h4>
                        <p>Secure Payment Options</p>

                        <div
                          className={
                            activeCard === "payment"
                              ? "checkout_order_online_form_0283"
                              : "checkout_order_online_form_0283 hide"
                          }
                        >
                          <div className="row">
                            {cartItems?.paymentOptions?.stripe == "Enabled" && (
                              <>
                                <div className="col-6">
                                  <div
                                    className={
                                      paymentOption === "stripe"
                                        ? "card payment_card_order_online_093 selected"
                                        : "card payment_card_order_online_093"
                                    }
                                    onClick={createPaymentIntentRequest}
                                  >
                                    <i>
                                      {/* <Bs.BsCreditCard /> */}
                                      <h4>Card Payment</h4>
                                    </i>
                                  </div>
                                </div>
                              </>
                            )}
                            {cartItems?.paymentOptions?.cod == "Enabled" && (
                              <>
                                <div className="col-6">
                                  <div
                                    className={
                                      paymentOption === "cash"
                                        ? "card payment_card_order_online_093 selected"
                                        : "card payment_card_order_online_093"
                                    }
                                    onClick={() => handlecashondelivery()}
                                  >
                                    <i>
                                      {/* <Bs.BsCashCoin /> */}
                                      <h4>Cash Payment</h4>
                                    </i>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          {paymentOption === "stripe" &&
                            stripePaymentClientSecret && (
                              <div className="payement_method checkout_form mt-3 pt-3 card p-3 m-1">
                                <Elements
                                  stripe={stripePromise}
                                  options={options}
                                >
                                  <StripePaymentElementOrderOnline
                                    paymentSuccess={async (intentResult) => {
                                      console.log("intentResult", intentResult);
                                      sessionStorage.clear("isCheckoutActive");
                                      await completeOrder();
                                    }}
                                    paymentFailure={(err) => {
                                      console.log("error =>", err.message);
                                      toast.error(err.message);
                                    }}
                                    discount={discountData}
                                    formState={formState}
                                    paymentMethod={paymentOption}
                                  />
                                </Elements>
                              </div>
                            )}
                        </div>
                        {paymentOption === "cash" && (
                          <Fragment>
                            <p className="cash_payment_info_939">
                              <IoInformationCircleOutline />{" "}
                              <span>
                                You are Choosing Cash on Delivery Press Submit
                                Button to Continue
                              </span>
                            </p>
                            <br />
                            <button
                              type="button"
                              className="cash_payment_submit_btn_order_online"
                              onClick={completeOrder}
                              disabled={loading}
                            >
                              {!loading ? (
                                "Submit"
                              ) : (
                                <Fragment>
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  <span className="sr-only"> Loading...</span>
                                </Fragment>
                              )}
                            </button>
                          </Fragment>
                        )}
                      </Fragment>
                    ) : (
                      <PleaseWait />
                    )}
                  </>
                ) : (
                  <h6 style={{ color: "red" }}></h6>
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="lg_summary">
                <CheckoutSummaryComp />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default OrderSummaryCheckout;
