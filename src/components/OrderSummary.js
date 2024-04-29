import React, { Fragment, useContext, useState } from "react";
import * as Fa from "react-icons/fa";
import { AppContext } from "../context/AppContext";

function OrderSummary() {
  const { cartItems } = useContext(AppContext);
  const [added, setAdded] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("delivery");

  console.log(cartItems);

  return (
    <div>
      <h3 className="order_title">Order Summary</h3>
      <div className="summary_item_wrapper_029">
        <div className="summary_card card">
          {cartItems &&
            cartItems.cartItems.map((item, index) => {
              const addOns = item?.addon_apllied;
              const masterAddons = item?.master_addon_apllied;

              console.log("addons", masterAddons);
              return (
                <Fragment>
                  <div className="position-relative">
                    <div className="d-flex">
                      <p className="food_menu m-0">
                        <strong>{item?.productName ?? "N/A"}</strong>
                      </p>
                      <button
                        type="button"
                        className="remove"
                        onClick={() => setAdded(false)}
                      >
                        <Fa.FaRegTrashAlt />
                      </button>
                    </div>
                    <table className="addOnsList028">
                      {addOns &&
                        addOns.length != 0 &&
                        addOns.map((add, index) => {
                          return (
                            <Fragment>
                              <span>
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
                              <span>
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
                    <div className="d-flex">
                      <div className="inc_dec_wrapper_order_summary">
                        <button className="summary_qty_btn dec_btn_order_summary">
                          -
                        </button>
                        <span>{item?.quantity}</span>
                        <button className="summary_qty_btn inc_btn_order_summary">
                          +
                        </button>
                      </div>
                      <p className="price_summary_1">{item?.product_total_price}</p>
                    </div>
                  </div>
                  <br />
                </Fragment>
              );
            })}
          <hr />
          <table className="total_cost_summary">
            <tr>
              <td>Total Cost</td>
              <td>{cartItems?.cartTotal?.cartTotalPriceDisplay ?? "N/A"}</td>
            </tr>
          </table>
        </div>
      </div>

      <br />
      {/* <div className="line__"></div>
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
            <input type="text" name="" id="" className="opt_input_827" />
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <label htmlFor="" className="opt_label_827">
            Picup Time
          </label>
          <div className="inp_wrapper_827">
            <input type="time" name="" id="" className="opt_input_827" />
          </div>
        </Fragment>
      )}
      <button type="button" className="order_now_192">
        Order Now
      </button> */}
    </div>
  );
}

export default OrderSummary;
