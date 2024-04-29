import React, { Fragment, useContext, useState } from "react";
import * as Fa from "react-icons/fa";
import { AppContext } from "../context/AppContext";

function OrderSummary() {
  const { cartItems } = useContext(AppContext);
  const [added, setAdded] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("delivery");

  return (
    <div>
      <h3 className="order_title">Order Summary</h3>
      <div className="summary_item_wrapper_029">
        <div className="summary_card card">
          <p className="food_menu">Shawarma</p>
          <table className="addOnsList028">
            <tr>
              <td>Dessert</td>
              <td>+22</td>
            </tr>
            <tr>
              <td>Pickle</td>
              <td>+5</td>
            </tr>
            <tr>
              <td>Salads</td>
              <td>+12</td>
            </tr>
          </table>
          <div className="d-flex">
            <p className="price_summary_1">£204</p>
            <div className="inc_dec_wrapper_order_summary">
              <button className="summary_qty_btn dec_btn_order_summary">
                -
              </button>
              <span>1</span>
              <button className="summary_qty_btn inc_btn_order_summary">
                +
              </button>
            </div>
          </div>
          <button
            type="button"
            className="remove"
            onClick={() => setAdded(false)}
          >
            <Fa.FaRegTrashAlt />
          </button>
          <hr />
          <table className="total_cost_summary">
            <tr>
              <td>Total Cost</td>
              <td>£204</td>
            </tr>
          </table>
        </div>
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
      </button>
    </div>
  );
}

export default OrderSummary;
