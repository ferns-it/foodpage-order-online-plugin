import React, { useState } from "react";
import BaseClient from "../helper/Baseclients";
import { APIEndpoints } from "../constants/APIEndpoints";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

export default function usePayment() {
  const [loading, setLoading] = useState(false);
  const [isPaymentElementLoaded, setIsPaymentElementLoaded] = useState(false);
  const [stripePaymentClientSecret, setStripeClientSecret] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [type, setType] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

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

  const createPaymentIntent = async (
    payload,
    { onSuccess, onFailed, headers }
  ) => {
    await BaseClient.post(APIEndpoints.createPaymentIntent, payload, {
      headers: headers,
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

      if (
        paymentIntent &&
        (paymentIntent.status === "succeeded" ||
          paymentIntent.status === "requires_capture")
      ) {
        await paymentSuccess(paymentIntent);
        setPaymentStatus(true);
      } else if (error) {
        console.log(error);
        await paymentFailure(error);
        setPaymentStatus(false);
      }
    } finally {
      setLoading(false);
      setPaymentStatus(null);
    }
  };

  const completeCheckout = async (
    payload,
    { onSuccess, onFailed, headers }
  ) => {
    try {
      setLoading(true);
      await BaseClient.post(APIEndpoints.completecheckout, payload, {
        headers: headers,
        onSuccess: (data) => {
          onSuccess(data);
          setOrderDetails(data);
          window.sessionStorage.clear();
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
  const getDiscount = async (payload, { onSuccess, onFailed, headers }) => {
    try {
      setLoading(true);
      await BaseClient.post(APIEndpoints.completecheckout, payload, {
        headers: headers,
        onSuccess: (data) => {
          onSuccess(data);
          setOrderDetails(data);
          window.sessionStorage.clear();
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
  const GuestDiscountoftakeaway = async (
    payload,
    { onSuccess, onFailed, headers }
  ) => {
    try {
      setDeliveryLoading(true);
      await BaseClient.post(APIEndpoints.getDiscountForGuest, payload, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setDeliveryLoading(false);
    }
  };
  const GuestDeliveryDetails = async (
    payload,
    { onSuccess, onFailed, headers }
  ) => {
    try {
      setDeliveryLoading(true);
      await BaseClient.post(APIEndpoints.getDeliveryDiscountGuest, payload, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setDeliveryLoading(false);
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
    type,
    setType,
    paymentData,
    deliveryFee,
    setDeliveryFee,
    GuestDeliveryDetails,
    GuestDiscountoftakeaway,
    deliveryLoading,
    paymentError,
    setPaymentData,
  };
}
