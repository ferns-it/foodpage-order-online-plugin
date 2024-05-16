import React, { Fragment } from "react";
import { PiKey } from "react-icons/pi";

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
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Eligendi, saepe!
                </p>
                <br />
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
                  <button type="submit" className="online_order_plugin_login_btn">Login</button>
                </form>
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
