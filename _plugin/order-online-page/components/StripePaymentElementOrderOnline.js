import React, { Fragment, useState, useContext } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { AppContext } from "../context";
import "../style/order-online-style.css";

function StripePaymentElementOrderOnline({
  formState,
  discount,
  paymentMethod,
  ...props
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentLoading, setPaymentLoading] = useState(false);

  console.log("payment component", formState, discount, paymentMethod);

  const { onPaymentElementReady, stripePaymentClientSecret, confirmPayment } =
    useContext(AppContext);

  const handleOrder = async () => {
    setPaymentLoading(true);
    await confirmPayment({
      stripe,
      elements,
      paymentSuccess: props.paymentSuccess,
      paymentFailure: props.paymentFailure,
    });
    setPaymentLoading(false);
  };
  return (
    <Fragment>
      <PaymentElement id="payment-element" onReady={onPaymentElementReady} />
      <p className="termsconditions mb-3 mt-3">
        By clicking the "Order now", You agreeing our{" "}
        <a href="/" target="_blank">
          terms & Conditions
        </a>
      </p>

      {paymentLoading ? (
        <button className="btn checkout_btn_order_online " type="submit" disabled>
          Submitting
        </button>
      ) : (
        <button
          className="checkout_btn_order_online "
          type="button"
          onClick={handleOrder}
          disabled={!stripePaymentClientSecret}
        >
          Order Now
        </button>
      )}
    </Fragment>
  );
}

export default StripePaymentElementOrderOnline;
