import React, { Fragment } from "react";
import { PiKey } from "react-icons/pi";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import * as Bs from "react-icons/bs";

import "../style/OrderOnlineApp.css";

function OrderSummaryCheckout() {
  return (
    <Fragment>
      <section className="order_summary_checkout">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8">
              <div className="card login_summary_card_0928">
                <div className="login_summary_card_ico_0928">
                  <PiKey />
                </div>
                <h4>Account</h4>
                <p>To proceed with your order, please register with us!</p>

                <div className="login_order_online_form_0283 hide">
                  <p id="sub_summary_txt">Enter your details</p>
                  <form>
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
                            className="form-control online_order_plugin_input_2939"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="postalcode"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Postal Code
                          </label>
                          <input
                            type="text"
                            name="postalcode"
                            id=""
                            className="form-control online_order_plugin_input_2939"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group">
                          <label
                            htmlFor="email"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Email Address
                          </label>
                          <input
                            type="text"
                            name="email"
                            id=""
                            className="form-control online_order_plugin_input_2939"
                          />
                        </div>
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
                            className="form-control online_order_plugin_input_2939"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
                        <div className="form-group">
                          <label
                            htmlFor="email"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            name="address1"
                            id=""
                            className="form-control online_order_plugin_input_2939"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
                        <div className="form-group">
                          <label
                            htmlFor="email"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            name="address2"
                            id=""
                            className="form-control online_order_plugin_input_2939"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
                        <div className="form-group">
                          <label
                            htmlFor="email"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Town/City
                          </label>
                          <input
                            type="text"
                            name="city"
                            id=""
                            className="form-control online_order_plugin_input_2939"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-4 mt-3">
                        <div className="form-group">
                          <label
                            htmlFor="email"
                            className="form-label online_order_plugin_label_2939"
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            id=""
                            className="form-control online_order_plugin_input_2939"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group mt-3">
                      <label
                        htmlFor=""
                        className="form-label online_order_plugin_label_2939"
                      >
                        Notes
                      </label>
                      <textarea
                        name=""
                        id=""
                        className="form-control online_order_plugin_txtarea_2939"
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

              <div className="card login_summary_card_0928">
                <div className="login_summary_card_ico_0928">
                  <RiMoneyEuroCircleLine />
                </div>

                <h4>Payment</h4>
                <p>Secure Payment Options</p>
                <div className="login_order_online_form_0283">
                  <div className="row">
                    <div className="col-6">
                      <div className="card payment_card_order_online_093 selected">
                        <i>
                          <Bs.BsCreditCard />
                          <h4>Card Payment</h4>
                        </i>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card payment_card_order_online_093">
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
