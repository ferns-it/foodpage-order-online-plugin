"use client";
import useMenus from "../hooks/useMenus";
import { createContext, useState, useEffect, useContext } from "react";
import usePayment from "../hooks/usePayment";
import useAuth from "../hooks/useAuth";
import Utils from "../../_utils/Utils";
import useProfile from "../hooks/useProfile";

import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/dist/server/api-utils";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  redirectToLocation,
  setLocalStorageItem,
  setSessionStorageItem,
} from "../../_utils/ClientUtils";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [productsList, setProductsList] = useState([]);
  const [delivery, setDelivery] = useState(false);
  const [productsListLoading, setProductsLoading] = useState(false);
  // const [isCheckoutActive, setisCheckoutActive] = useState(false);
  const [locationResponseData, setLocationResponseData] = useState(null);
  const [isUserLogged, setIsUserLogged] = useState(null);
  const [amount, setAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const shopId = process.env.SHOP_ID;
  const [activeCard, setActiveCard] = useState("login");
  const [userInformation, setUserInformation] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUser, setIsUser] = useState(null);
  const [orderHistoryLoading, setOrderHistoryLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mergedState, setMergedState] = useState(null);
  const isCheckoutActive = false;
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    const isCheckout = sessionStorage.getItem("isCheckoutActive");
    const token = localStorage.getItem("userToken");

    if (token != null) {
      localStorage.setItem("userToken", token);
      setIsUser(token);
    }
    const isGuest = localStorage.getItem("guest");

    const guestId = getLocalStorageItem("UserPersistent");

    if (!guestId) {
      const tempId = Utils.generateRandomId();
      setLocalStorageItem("UserPersistent", tempId);
    }
    if (!isCheckout) {
      setSessionStorageItem("isCheckoutActive", false);
    }

    if ((token != null && isGuest == false) || isGuest == "false") {
      const jwt = require("jsonwebtoken");
      const encodedToken = getLocalStorageItem("userToken");

      const decodedToken = jwt.decode(encodedToken, { complete: true });

      setIsUserLogged(decodedToken);
    }
  }, []);

  const {
    fetchMenuList,
    fetchCategoriesList,
    fetchProductsList,
    menuList,
    categoryList,
    menuLoading,
    addToCart,
    fetchCartList,
    cartItems,
    getLocation,
    locationResponse,
    deleteSingleCartItem,
    cartLoading,
    getShopSettings,
    settings,
    deliveryInfo,
    categoryLoading,
    settingsLoading,
    setCartItems,
    clearCartItems,
    diningMenuList,
    diningLoading,
    diningList,
    fetchCurrentShopStatus,
    currentStatus,
    updateCart,
    fetchAllProducts,
    allProductsList,
  } = useMenus();
  const {
    authLoading,
    sentOTPtoUser,
    userLogin,
    confirmPassword,
    registerUser,
    transferCartItem,
    passwordResetMail,
    resetPassword,
  } = useAuth();
  const {
    fetchAddressList,
    address,
    addressLoading,
    addNewAddress,
    addressDetails,
    deleteAddress,
    fetchDefaultAddress,
    getUserInformation,
    userLoading,
    userInfo,
    userNewAddress,
    userAddressList,
    setUserInfo,
    expired,
    setDefaultAddress,
    deleteSavedAddress,
    userOrderHistory,
    fetchOrderHistory,
    fetchReservationData,
    reservationList,
    fetchReservationList,
    tableReservationList,
  } = useProfile();
  // const {
  //   fetchOrderList,
  //   orderLoading,
  //   orderHistory,
  //   fetchOrderDetails,
  //   orderList,
  //   // orderDetails
  // } = useOrderHistory();
  const {
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
    paymentError,
    setPaymentData,
    deliveryLoading,
    GuestDeliveryDetails,
    GuestDiscountoftakeaway,
    createReservPaymentIntent,
  } = usePayment();

  function isTokenExpired(decodedToken) {
    if (!decodedToken || !decodedToken.exp) {
      return true; // Assume expired if token is invalid
    }
    const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  }
  useEffect(() => {
    const userToken = getLocalStorageItem("userToken");
    const userId = getSessionStorageItem("UserPersistent");
    getShopSettings();
    fetchCategoriesList();
    fetchCartList(userId);
    diningMenuList();
    fetchMenuList();
    fetchAllProducts();
    fetchCurrentShopStatus();

    if (userToken) {
      const decodedToken = jwtDecode(userToken);

      const isExpired = isTokenExpired(decodedToken);
      if (isExpired == true) {
        localStorage.removeItem("userToken");
        redirectToLocation("/");
        return;
      }
      setUserInformation(decodedToken);
      fetchAddressList(userToken);
      fetchReservationList(userToken);
      fetchDefaultAddress(userToken);
      getUserInformation(userToken);
      fetchOrderHistory(userToken);
      fetchReservationData(userToken);
    }
  }, []);

  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      setSelectedCategory(categoryList[0].cID);
    }
  }, [categoryList]);

  useEffect(() => {
    if (productsList.length == 0) {
      if (!categoryList || categoryList.length === 0) return;

      if (!categoryList) return;

      const validCategories = categoryList.filter(
        (list) => list.productsCount?.online > 0
      );

      const catId =
        validCategories &&
        validCategories.length > 0 &&
        validCategories[0]?.cID;

      const isCheck =
        productsList &&
        productsList.length != 0 &&
        productsList.some((x) => x.cID == cID);
      if ((!productsList || productsList.length == 0) && !isCheck) {
        fetchSingleProduct(catId);
      }
    }
    //  else {
    //   setProductsList(data);
    // }
  }, [categoryList, productsList, selectedCategory]);

  useEffect(() => {
    if (!productsList || productsList.length == 0) return;

    sessionStorage.setItem("foodList", JSON.stringify(productsList));
  }, [productsList]);

  const fetchSingleProduct = async (catId) => {
    try {
      setProductsLoading(true);
      const data = {
        shopId,
        categoryId: catId,
      };

      const pro = await fetchProductsList(data);
      const category = categoryList && categoryList.find((x) => x.cID == catId);
      const productData = {
        categoryName: category?.name,
        cID: category?.cID,
        products: pro,
      };
      setProductsList((prev) => {
        const updated = prev.filter((item) => item.cID !== productData.cID);
        return [...updated, productData];
      });
    } finally {
      setProductsLoading(false);
    }
  };

  //for clearing the session storage
  const clearSessionStorageKey = () => {
    sessionStorage.removeItem("foodList");
  };

  useEffect(() => {
    clearSessionStorageKey();

    const intervalId = setInterval(() => {
      clearSessionStorageKey();
    }, 1800000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AppContext.Provider
      value={{
        fetchMenuList,
        menuList,
        menuLoading,
        fetchCategoriesList,
        categoryList,
        fetchProductsList,
        addToCart,
        locationResponse,
        fetchCartList,
        cartItems,
        getLocation,
        productsList,
        fetchSingleProduct,
        productsListLoading,
        shopId,
        getShopSettings,
        settings,
        deleteSingleCartItem,
        deliveryInfo,
        delivery,
        setDelivery,
        isCheckoutActive,
        // setisCheckoutActive,
        locationResponseData,
        setLocationResponseData,
        deliveryFee,
        setDeliveryFee,
        type,
        setType,
        createPaymentIntent,
        stripePaymentClientSecret,
        setStripeClientSecret,
        stripePromise,
        options,
        onPaymentElementReady,
        billingAddress,
        setBillingAddress,
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
        activeCard,
        setActiveCard,
        isPageLoading,
        setIsPageLoading,
        filterLoading,
        setIsUserLogged,
        setFilterLoading,
        cartLoading,
        categoryLoading,
        loading,
        setOrderDetails,
        isPaymentElementLoaded,
        setIsPaymentElementLoaded,
        paymentStatus,
        authLoading,
        sentOTPtoUser,
        userLogin,
        confirmPassword,
        registerUser,
        settingsLoading,
        isUserLogged,
        transferCartItem,
        passwordResetMail,
        showModal,
        setShowModal,
        fetchAddressList,
        resetPassword,
        address,
        addressLoading,
        addNewAddress,
        deleteAddress,
        fetchDefaultAddress,
        // fetchOrderList,
        // orderLoading,
        // orderHistory,
        // fetchOrderDetails,
        addressDetails,
        // orderList,
        setCartItems,
        clearCartItems,
        deliveryLoading,
        GuestDiscountoftakeaway,
        GuestDeliveryDetails,
        diningMenuList,
        diningLoading,
        diningList,
        currentStatus,
        fetchAddressList,
        address,
        addressLoading,
        addNewAddress,
        addressDetails,
        deleteAddress,
        fetchDefaultAddress,
        getUserInformation,
        userLoading,
        userInfo,
        userNewAddress,
        userAddressList,
        setUserInfo,
        expired,
        updateCart,
        setDefaultAddress,
        deleteSavedAddress,
        fetchOrderHistory,
        fetchReservationData,
        reservationList,
        userOrderHistory,
        isUser,
        createReservPaymentIntent,
        fetchReservationList,
        tableReservationList,
        userInformation,
        mergedState,
        setMergedState,
        fetchAllProducts,
        allProductsList,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export function appContext() {
  return useContext(AppContext);
}
