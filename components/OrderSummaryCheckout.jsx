import React, { Fragment } from "react";
import "../style/OrderOnlineApp.css"

function OrderSummaryCheckout() {
  return (
    <Fragment>
      <section className="order_summary_checkout">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8">
                <h2>Guest Login</h2>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4"></div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default OrderSummaryCheckout;
