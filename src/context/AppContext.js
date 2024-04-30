import React, { createContext, useContext, useEffect, useState } from "react";
import useMenus from "../hooks/useMenus";

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
    deleteSingleCartItem
  } = useMenus();

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
        deleteSingleCartItem
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
