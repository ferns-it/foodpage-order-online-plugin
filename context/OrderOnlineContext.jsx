import React, { createContext, useContext, useEffect, useState } from "react";
import useMenus from "../hooks/useMenus";
import useShop from "../hooks/useShop";
import usePayment from "../hooks/usePayment";

export const OrderOnlineContext = createContext();

export const OrderOnlineContextProvider = (props) => {
  const [paramsValues, setParamsValues] = useState(null);
  const [delivery, setDelivery] = useState(false);
  const [locationResponseData, setLocationResponseData] = useState(null);
  const [isCheckoutActive, setisCheckoutActive] = useState(false);
  const [activeCard, setActiveCard] = useState("login");
  const [deliveryFee, setDeliveryFee] = useState(null);

  const {
    fetchMenuList,
    menuList,
    fetchCategoriesList,
    menuLoading,
    categoryList,
    fetchProductsList,
    productsList,
    addToCart,
    fetchCartList,
    cartItems,
    cartLoading,
    deleteSingleCartItem,
    locationResponse,
    deleteCartItem,
  } = useMenus();

  const { settings, getShopSettings, settingsLoading } = useShop();

  const {
    isAuthenticated,
    setIsSignUp,
    isSignup,
    therapies,
    createPaymentIntent,
    stripePaymentClientSecret,
    setStripeClientSecret,
    stripePromise,
    options,
    setSelectedScheduleSlot,
    selectedScheduleSlot,
    onPaymentElementReady,
    billingAddress,
    setBillingAddress,
    selectedBookingDate,
    confirmPayment,
    amount,
    setAmount,
    completeCheckout,
    type,
    setType,
    paymentData,
    orderDetails,
    paymentError,
    setPaymentData,
  } = usePayment();

  useEffect(() => {
    fetchProductsList();
    fetchCartList();
  }, []);

  useEffect(() => {
    if (!paramsValues) return;
    fetchMenuList(paramsValues.shopId);
    fetchCategoriesList(paramsValues.shopUrl);
  }, [paramsValues]);

  return (
    <OrderOnlineContext.Provider
      value={{
        fetchMenuList,
        menuList,
        menuLoading,
        categoryList,
        fetchProductsList,
        productsList,
        fetchCategoriesList,
        addToCart,
        fetchCartList,
        cartItems,
        cartLoading,
        deleteSingleCartItem,
        locationResponse,
        settings,
        getShopSettings,
        settingsLoading,
        deleteCartItem,
        paramsValues,
        setParamsValues,
        isAuthenticated,
        setIsSignUp,
        isSignup,
        therapies,
        createPaymentIntent,
        stripePaymentClientSecret,
        setStripeClientSecret,
        stripePromise,
        options,
        setSelectedScheduleSlot,
        selectedScheduleSlot,
        onPaymentElementReady,
        billingAddress,
        setBillingAddress,
        selectedBookingDate,
        confirmPayment,
        amount,
        setAmount,
        completeCheckout,
        type,
        setType,
        deliveryFee,
        setDeliveryFee,
        paymentData,
        orderDetails,
        delivery,
        setDelivery,
        locationResponseData,
        setLocationResponseData,
        isCheckoutActive,
        setisCheckoutActive,
        activeCard,
        setActiveCard,
        paymentError,
        setPaymentData,
      }}
    >
      {props.children}
    </OrderOnlineContext.Provider>
  );
};
