import React, { useEffect, useState, createContext } from "react";
import useMenus from "../hooks/useMenus";
import useShop from "../hooks/useShop";
import usePayment from "../hooks/usePayment";
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [products, setProducts] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [paramsValues, setParamsValues] = useState(null);
  const [delivery, setDelivery] = useState(false);
  const [locationResponseData, setLocationResponseData] = useState(null);
  const [isCheckoutActive, setisCheckoutActive] = useState(false);
  const [activeCard, setActiveCard] = useState("login");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const shopId = 1;

  const {
    fetchMenuList,
    menuList,
    fetchCategoriesList,
    menuLoading,
    categoryList,
    fetchProductsList,
    addToCart,
    locationResponse,
    fetchCartList,
    cartItems,
    getLocation,
    categoryLoading,
    productsList,
    cartLoading,
    deleteSingleCartItem,
    responseError,
  } = useMenus();

  const { settings, getShopSettings, settingsLoading, deleteCartItem } =
    useShop();

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
    fetchCategoriesList();
    fetchMenuList();
    fetchProductsList();
    fetchCartList();
    getShopSettings();
  }, []);

  useEffect(() => {
    if (!categoryList || categoryList.length === 0) return;

    const fetchData = async () => {
      try {
        setProductsLoading(true);
        const pro = await Promise.all(
          categoryList.map(async (item) => {
            const data = {
              shopId,
              categoryId: item?.cID,
            };

            const productRespo = await fetchProductsList(data);
            return {
              categoryName: item?.name,
              categoryId: item?.cID,
              product: productRespo,
            };
          })
        );
        setProducts(pro);
      } finally {
        setProductsLoading(false);
      }
    };

    if (!products) {
      fetchData();
    }
  }, [categoryList]);

  return (
    <AppContext.Provider
      value={{
        fetchMenuList,
        menuList,
        menuLoading,
        categoryList,
        fetchCartList,
        cartItems,
        addToCart,
        fetchProductsList,
        settings,
        getShopSettings,
        settingsLoading,
        getLocation,
        locationResponse,
        deleteCartItem,
        isAuthenticated,
        setIsSignUp,
        isSignup,
        therapies,
        onPaymentElementReady,
        createPaymentIntent,
        stripePaymentClientSecret,
        setStripeClientSecret,
        stripePromise,
        options,
        setSelectedScheduleSlot,
        selectedScheduleSlot,
        completeCheckout,
        billingAddress,
        setBillingAddress,
        selectedBookingDate,
        confirmPayment,
        amount,
        setAmount,
        setDeliveryFee,
        type,
        setType,
        deliveryFee,
        orderDetails,
        paymentData,
        products,
        setProducts,
        productsLoading,
        categoryLoading,
        productsList,
        cartLoading,
        deleteSingleCartItem,
        responseError,
        paramsValues,
        setParamsValues,
        delivery,
        setDelivery,
        locationResponseData,
        setLocationResponseData,
        isCheckoutActive,
        setisCheckoutActive,
        activeCard,
        setActiveCard,
        isPageLoading,
        setIsPageLoading,
        filterLoading,
        setFilterLoading,
        shopId,
        paymentError,
        setPaymentData,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
