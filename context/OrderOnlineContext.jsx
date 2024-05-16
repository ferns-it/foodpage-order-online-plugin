import React, { createContext, useContext, useEffect, useState } from "react";
import useMenus from "../hooks/useMenus";
import useShop from "../hooks/useShop";
import usePayment from "../hooks/usePayment";

export const OrderOnlineContext = createContext();

export const OrderOnlineContextProvider = (props) => {
  const [paramsValues, setParamsValues] = useState(null);
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
    getLocation,
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
    deliveryFee,
    setDeliveryFee,
    paymentData,
    orderDetails,
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
        getLocation,
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
      }}
    >
      {props.children}
    </OrderOnlineContext.Provider>
  );
};
