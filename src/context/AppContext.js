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
  } = useMenus();

  useEffect(() => {
    fetchMenuList();
    fetchCategoriesList();
    fetchProductsList();
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
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
