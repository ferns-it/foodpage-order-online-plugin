import React from "react";

function OrderSummary() {
  return (
    <div>
      <div className="billing_block bill-spikes">
        <h3 className="order_title">Order Summary</h3>
        <div className="summary_item_wrapper_029">
          {added && (
            <div className="summary_card card">
              <p className="food_menu">Food Name</p>
              <p className="price_summary_1">£190</p>

              <button
                type="button"
                className="remove"
                onClick={() => setAdded(false)}
              >
                <Fa.FaRegTrashAlt />
              </button>
            </div>
          )}
          <div className="summary_card card">
            <p className="food_menu">Food Name</p>
            <p className="price_summary_1">£190</p>

            <button
              type="button"
              className="remove"
              onClick={() => setAdded(false)}
            >
              <Fa.FaRegTrashAlt />
            </button>
          </div>
          <div className="summary_card card">
            <p className="food_menu">Food Name</p>
            <p className="price_summary_1">£190</p>

            <button
              type="button"
              className="remove"
              onClick={() => setAdded(false)}
            >
              <Fa.FaRegTrashAlt />
            </button>
          </div>
          <div className="summary_card card">
            <p className="food_menu">Food Name</p>
            <p className="price_summary_1">£190</p>

            <button
              type="button"
              className="remove"
              onClick={() => setAdded(false)}
            >
              <Fa.FaRegTrashAlt />
            </button>
          </div>
          <div className="summary_card card">
            <p className="food_menu">Food Name</p>
            <p className="price_summary_1">£190</p>

            <button
              type="button"
              className="remove"
              onClick={() => setAdded(false)}
            >
              <Fa.FaRegTrashAlt />
            </button>
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
    </div>
  );
}

export default OrderSummary;
