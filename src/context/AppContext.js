import React, { createContext, useContext, useEffect, useState } from "react";
import useMenus from "../hooks/useMenus";
import useShop from "../hooks/useShop";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
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
    fetchMenuList();
    fetchCategoriesList();
    fetchProductsList();
    fetchCartList();
  }, []);

  return (
    <AppContext.Provider
      value={{
        fetchMenuList,
        menuList,
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
        settings,
        getShopSettings,
        settingsLoading,
        deleteCartItem,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
