import React, { useEffect, useState, createContext } from "react";
import useMenus from "../hooks/useMenus";
import useShop from "../hooks/useShop";
import usePayment from "../hooks/usePayment";
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [products, setProducts] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);

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
    deliveryFee,
    setDeliveryFee,
    paymentData,
    orderDetails,
  } = usePayment();

  useEffect(() => {
    fetchMenuList();
    fetchCategoriesList();
    fetchProductsList();
    fetchCartList();
    getShopSettings();
  }, []);

  useEffect(() => {
    console.log("categoryList", categoryList);

    if (!categoryList || categoryList.length === 0) return;

    const fetchData = async () => {
      try {
        setProductsLoading(true);
        const pro = await Promise.all(
          categoryList.map(async (item) => {
            const data = {
              shopId: 59,
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
        deliveryFee,
        confirmPayment,
        amount,
        setAmount,
        setDeliveryFee,
        type,
        setType,
        deliveryFee,
        orderDetails,
        setDeliveryFee,
        paymentData,
        products,
        setProducts,
        productsLoading,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
