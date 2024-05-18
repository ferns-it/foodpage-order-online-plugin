import React, { Fragment, useContext, useEffect, useState } from "react";
import { PiKey } from "react-icons/pi";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import * as Bs from "react-icons/bs";

import "../style/OrderOnlineApp.css";
import toast from "react-hot-toast";
import { OrderOnlineContext } from "../context/OrderOnlineContext";
import CheckoutSummaryComp from "./CheckoutSummaryComp";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentElementOrderOnline from "./StripePaymentElementOrderOnline";
import { useNavigate } from "react-router-dom";
import PleaseWait from "./PleaseWait";
import { FiArrowLeft } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";

function OrderSummaryCheckout() {
  const navigate = useNavigate();
  const {
    delivery,
    setisCheckoutActive,
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
  } = useContext(OrderOnlineContext);

  const [paymentOption, setPaymentOption] = useState("");
  const [formState, setFormState] = useState({
    fullname: "",
    postalCode: "",
    emailAddress: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    townCity: "",
    county: "",
    notes: "",
  });
  const [fieldError, setFieldError] = useState(false);
  const [discountData, setDiscountData] = useState(null);
  const [intentLoading, setIntentLoading] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();

      event.returnValue = "Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const postalCode = sessionStorage.getItem("postcode");
    if (!postalCode) {
      toast.error("Postal code is undefined");
      return;
    }
    setFormState({ ...formState, postalCode });
  }, []);

  useEffect(() => {
    if (delivery === null) return;

    setActiveCard(!delivery ? "login" : "payment");
  }, [delivery]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({ ...formState, [name]: value });
  };

  const handleEmptyValidation = () => {
    for (const key in formState) {
      if (typeof formState[key] !== "string" || formState[key].trim() === "") {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let deliveryTypeData;
    if (delivery == false) {
      deliveryTypeData = "Home Delivery";

      const isValid = handleEmptyValidation();

      if (isValid === true) {
        setFieldError(true);
        return;
      }
    } else {
      deliveryTypeData = "Take Away";
    }

    setActiveCard("payment");
  };

  const createPaymentIntentRequest = async () => {
    const discount = sessionStorage.getItem("discount");
    const fees = sessionStorage.getItem("delFee");
    const restId = sessionStorage.getItem("restaurantId");
    setDiscountData(discount);
    setPaymentOption("stripe");

    if (paymentData == null) {
      try {
        setIntentLoading(true);
        await createPaymentIntent(
          {
            devliveryCharges: deliveryFee * 100,
            discountAmount: discount * 100,
            shopID: restId,
          },

          {
            onSuccess: (res) => {
              const result = res?.data?.data?.paymentIntent?.client_secret;
              console.log(result);
              if (result != null) {
                setStripeClientSecret(result);
              }
            },

            onFailed: (error) => {
              console.log(error);
              toast.error(error?.message);
            },
          }
        );
      } finally {
        setIntentLoading(false);
      }
    }
  };

  const completeOrder = async () => {
    const data = paymentData?.data?.data;

    let deliveryType;
    if (delivery == false) {
      deliveryType = "Home Delivery";
    } else {
      deliveryType = "Take Away";
    }
    const paymentMethod = paymentOption === "card" ? "STRIPE" : "COD";

    if (paymentMethod === "STRIPE" && paymentData != null) {
      const payload = {
        shopID: data?.shopID,
        discount: discountData * 100,
        amount: amount * 100,
        deliveryType: deliveryType,
        deliveryCharge: data?.deliveryCharge,
        couponCode: "",
        couponType: "",
        couponValue: "",
        couponAmount: "",
        paymentStatus: "1",
        paymentGatway: paymentMethod,
        transactionID: data?.paymentIntent?.id,
        approxDeliveryTime: settings?.deliveryInfo?.minWaitingTime,
        deliveryNotes: formState?.notes,
        deliveryLocation: formState?.postalCode,
        takeawayTime: "",
        customer: {
          customerName: formState?.firstNameLastName,
          line1: formState?.addressLine1,
          line2: formState?.addressLine2,
          town: formState?.townCity,
          postcode: formState?.postalCode,
          county: formState?.county,
          landmark: "",
          email: formState?.emailAddress,
          phone: formState?.phone,
        },
      };

      await completeCheckout(payload, {
        onSuccess: async (res) => {
          toast.success("Order Confirmed!");
          await fetchCartList();

          setTimeout(() => {
            navigate("/");
          }, 1000);
        },
        onFailed: (err) => {
          toast.error(err.message);
        },
      });
    }
  };

  return (
    <Fragment>
      <section className="order_summary_checkout">
        <div className="container">
          <button
            className="back_btn_order_online_828"
            onClick={() => setisCheckoutActive(false)}
          >
            <FiArrowLeft />
          </button>
          <div className="row ">
            <div className="col-lg-8 col-md-8 col-sm-8 position-relative">
              <div className="card login_summary_card_0928">
                <div className="login_summary_card_ico_0928">
                  <PiKey />
                </div>
                <h4>Delivery Address</h4>
                {activeCard === "login" ? (
                  <p>To proceed with your order, please register with us!</p>
                ) : (
                  <p>Complete your payement</p>
                )}

                <div
                  className={
                    activeCard === "login" && delivery === false
                      ? "login_order_online_form_0283 "
                      : "login_order_online_form_0283 hide"
                  }
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
                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="postalCode"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Postal Code
                          </label>
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
                            value={formState.postalCode}
                            disabled
                          />
                        </div>
                        {fieldError == true &&
                          (!formState.postalCode ||
                            formState?.postalCode?.length === 0) && (
                            <span className="oos_err_29102">
                              Postal code is required!
                            </span>
                          )}
                      </div>
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
                      <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
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
                      <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
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
                      <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
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
                              fieldError &&
                              (!formState.addressLine2 ||
                                formState?.addressLine2.length == 0)
                                ? "form-control online_order_plugin_input_2939 error___"
                                : "form-control online_order_plugin_input_2939 "
                            }
                            onChange={handleChange}
                            value={formState.addressLine2}
                          />
                        </div>
                        {fieldError &&
                          (!formState.addressLine2 ||
                            formState?.addressLine2?.length == 0) && (
                            <span className="oos_err_29102">
                              Address Line 2 is required!
                            </span>
                          )}
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
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
                      <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
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
                            className={
                              fieldError &&
                              (!formState.county ||
                                formState?.county.length == 0)
                                ? "form-control online_order_plugin_input_2939 error___"
                                : "form-control online_order_plugin_input_2939 "
                            }
                            onChange={handleChange}
                            value={formState.county}
                          />
                        </div>
                        {fieldError &&
                          (!formState.county ||
                            formState?.county?.length == 0) && (
                            <span className="oos_err_29102">
                              Country is required!
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
                    <br />
                    <button
                      type="submit"
                      className="online_order_plugin_login_btn"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
              <div
                className={
                  activeCard == "login"
                    ? "order_online_horiz_line"
                    : "order_online_horiz_line short"
                }
              ></div>
              <div className="card login_summary_card_0928">
                <div className="login_summary_card_ico_0928">
                  <RiMoneyEuroCircleLine />
                </div>

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
                              <Bs.BsCreditCard />
                              <h4>Card Payment</h4>
                            </i>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className={
                              paymentOption === "cash"
                                ? "card payment_card_order_online_093 selected"
                                : "card payment_card_order_online_093"
                            }
                            onClick={() => setPaymentOption("cash")}
                          >
                            <i>
                              <Bs.BsCashCoin />
                              <h4>Cash Payment</h4>
                            </i>
                          </div>
                        </div>
                      </div>
                      {paymentOption === "stripe" &&
                        stripePaymentClientSecret && (
                          <div className="payement_method checkout_form mt-3 pt-3 card p-3 m-1">
                            <Elements stripe={stripePromise} options={options}>
                              <StripePaymentElementOrderOnline
                                paymentSuccess={async (intentResult) => {
                                  console.log(intentResult);
                                  await completeOrder();
                                }}
                                paymentFailure={(err) => {
                                  console.log(err);
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
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              <span class="sr-only"> Loading...</span>
                            </Fragment>
                          )}
                        </button>
                      </Fragment>
                    )}
                  </Fragment>
                ) : (
                  <PleaseWait />
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4">
              <CheckoutSummaryComp />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default OrderSummaryCheckout;
