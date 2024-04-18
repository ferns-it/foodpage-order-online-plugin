import React, { createContext, useContext, useEffect, useState } from "react";
import useMenus from "../hooks/useMenus";

export const AppContext = createContext();

export const AppContextProvider = (prpos) => {
  const { fetchMenuList, menuList, menuLoading } = useMenus();

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <AppContext.Provider
      value={{
        fetchMenuList,
        menuList,
        menuLoading,
      }}
    >
      {prpos.children}
    </AppContext.Provider>
  );
};
