import { useState } from "react";
import BaseClient from "../helper/Baseclient";
import { loadStripe } from "@stripe/stripe-js";
import { APIEndpoints } from "../constants/APIEndpoints";

export default function usePayment() {
  const [loading, setLoading] = useState(false);
  const [isPaymentElementLoaded, setIsPaymentElementLoaded] = useState(false);
  const [stripePaymentClientSecret, setStripeClientSecret] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [type, setType] = useState(null);
  const [amount, setAmount] = useState(0);
  const [paymentError, setPaymentError] = useState(null);

  const initialValue = {
    fullName: "",
    email: "",
    state: "",
    postcode: "",
  };

  const [billingAddress, setBillingAddress] = useState(initialValue);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

  const options = {
    appearance: {
      theme: "default",
    },
    clientSecret: stripePaymentClientSecret,
  };

  const createPaymentIntent = async (payload, { onSuccess, onFailed }) => {
    await BaseClient.post(APIEndpoints.createPaymentIntent, payload, {
      onSuccess: onSuccess,
      onFailed: onFailed,
      // authentication: true,
    });
  };

  const onPaymentElementReady = () => {
    setIsPaymentElementLoaded(true);
  };

  const confirmPayment = async ({
    stripe,
    elements,
    paymentSuccess,
    paymentFailure,
  }) => {
    try {
      if (!stripe || !elements) return;
      setLoading(true);
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment Success", paymentIntent);
        await paymentSuccess(paymentIntent);
        setPaymentStatus(true);
      } else if (error) {
        await paymentFailure(error);
        setPaymentStatus(false);
      }
    } finally {
      setLoading(false);
      setPaymentStatus(null);
    }
  };
  
  const completeCheckout = async (payload, { onSuccess, onFailed }) => {
    try {
      setLoading(true);
      await BaseClient.post(APIEndpoints.completecheckout, payload, {
        onSuccess: (data) => {
          onSuccess(data);
          setOrderDetails(data);
        },
        onFailed: (error) => {
          setPaymentError(error);
          console.error("error", error);
        },
        // authentication: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createPaymentIntent,
    stripePromise,
    loading,
    completeCheckout,
    orderDetails,
    setOrderDetails,
    onPaymentElementReady,
    isPaymentElementLoaded,
    options,
    stripePaymentClientSecret,
    setStripeClientSecret,
    confirmPayment,
    setIsPaymentElementLoaded,
    billingAddress,
    setBillingAddress,
    paymentStatus,
    amount,
    setAmount,
    type,
    setType,
    paymentData,
    deliveryFee,
    setDeliveryFee,
    paymentError,
    setPaymentData,
  };
}
