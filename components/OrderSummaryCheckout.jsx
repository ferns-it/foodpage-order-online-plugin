import React, { Fragment, useContext, useEffect, useState } from "react";
import { PiKey } from "react-icons/pi";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import * as Bs from "react-icons/bs";

import "../style/OrderOnlineApp.css";
import toast from "react-hot-toast";
import { OrderOnlineContext } from "../context/OrderOnlineContext";

function OrderSummaryCheckout() {
  const { delivery, cartItems } = useContext(OrderOnlineContext);
  const [paymentOption, setPaymentOption] = useState("");
  const [activeCard, setActiveCard] = useState("login");

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

    setActiveCard(delivery ? "login" : "payment");
  }, [delivery]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState({ ...formState, [name]: value });
  };

  const handleEmptyValidation = () => {
    console.log(formState);
    for (const key in formState) {
      if (typeof formState[key] !== "string" || formState[key].trim() === "") {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = handleEmptyValidation();

    if (isValid === true) {
      setFieldError(true);
      return;
    }
  };

  return (
    <Fragment>
      <section className="order_summary_checkout">
        <div className="container">
          <div className="row ">
            <div className="col-lg-8 col-md-8 col-sm-8 position-relative">
              <div className="card login_summary_card_0928">
                <div className="login_summary_card_ico_0928">
                  <PiKey />
                </div>
                <h4>Account</h4>
                <p>To proceed with your order, please register with us!</p>

                <div
                  className={
                    activeCard === "login" && delivery === true
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
                            onChange={handleChange}
                            value={formState.postalCode}
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
                      Login
                    </button>
                  </form>
                </div>
              </div>
              <div className="order_online_horiz_line"></div>
              <div className="card login_summary_card_0928">
                <div className="login_summary_card_ico_0928">
                  <RiMoneyEuroCircleLine />
                </div>

                <h4>Payment</h4>
                <p>Secure Payment Options</p>
                <div
                  className={
                    activeCard === "payment" && delivery === false
                      ? "checkout_order_online_form_0283"
                      : "checkout_order_online_form_0283 hide"
                  }
                >
                  <div className="row">
                    <div className="col-6">
                      <div
                        className={
                          paymentOption === "card"
                            ? "card payment_card_order_online_093 selected"
                            : "card payment_card_order_online_093"
                        }
                        onClick={() => setPaymentOption("card")}
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
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4"></div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default OrderSummaryCheckout;
