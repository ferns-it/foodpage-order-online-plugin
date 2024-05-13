import React, { createContext, useContext, useEffect, useState } from "react";
import useMenus from "../hooks/useMenus";
import useShop from "../hooks/useShop";

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
      }}
    >
      {props.children}
    </OrderOnlineContext.Provider>
  );
};
