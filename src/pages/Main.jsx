import React, { Fragment, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Toaster } from "react-hot-toast";
import Order from "./order/Order";
import OrderSummaryCheckout from "../components/OrderSummaryCheckout";
import * as Pi from "react-icons/pi";

function Main() {
  const { isCheckoutActive, settings } = useContext(AppContext);
  console.log("isCheckoutActive", settings);
  return (
    <Fragment>
      <Toaster position="top-center" reverseOrder={false} />
      {settings && settings?.shopStatus == "close" && (
        <p className="info-header">
          <i>
            <Pi.PiCallBellFill />
          </i>
          Sorry We're Temporarily Closed! Be Back Soon.
        </p>
      )}
      {isCheckoutActive === false ? <Order /> : <OrderSummaryCheckout />}
    </Fragment>
  );
}

export default Main;
