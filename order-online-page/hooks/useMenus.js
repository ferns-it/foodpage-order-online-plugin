"use client";
import { useState } from "react";
import BaseClient from "../helper/Baseclients";
import { APIEndpoints } from "../constants/APIEndpoints";
import { getLocalStorageItem } from "../../_utils/ClientUtils";

const useMenus = () => {
  const [menuList, setMenuList] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [categoryList, setCategoryList] = useState(null);
  const [settings, setSettings] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [locationResponse, setLocationResponse] = useState(null);
  const [cartItems, setCartItems] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const fetchMenuList = async () => {
    try {
      setMenuLoading(true);
      await BaseClient.get(APIEndpoints.menulist, [], {
        onSuccess: (res) => {
          setMenuList(res?.data);
        },
        onFailed: (err) => {
          console.log("Error on fetching menus", err);
        },
      });
    } finally {
      setMenuLoading(false);
    }
  };
  const fetchCurrentShopStatus = async () => {
    try {
      setSettingsLoading(true);
      await BaseClient.get(
        APIEndpoints.getCurrentShopStatus,
        {},
        {
          onSuccess: (res) => {
            // debugger;
            if (res && res?.data?.error == false) {
              setCurrentStatus(res?.data?.data);
            } else {
              setCurrentStatus(null);
            }
          },
          onFailed: (err) => {
            console.log("Shop status error", err);
          },
        }
      );
    } finally {
      setSettingsLoading(false);
    }
  };
  const deleteSingleCartItem = async (id, { onSuccess, onFailed }) => {
    try {
      setCartLoading(true);

      const userToken = getLocalStorageItem("UserPersistent");

      if (!userToken) {
        onFailed(new Error("User is not authenticated"));
        return;
      }
      const headers = {
        user: userToken,
      };
      await BaseClient.delete(APIEndpoints.deleteCartItem + `/${id}`, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } catch (error) {
      onFailed(error);
    } finally {
      setCartLoading(false);
    }
  };
  const fetchCategoriesList = async () => {
    try {
      setCategoryLoading(true);
      await BaseClient.get(APIEndpoints.categoryList, [], {
        onSuccess: (res) => {
          // setCategoryList(res?.data?.data?.items);
        },
        onFailed: (err) => {
          console.log("Error on fetching menus", err);
        },
      });
    } finally {
      setCategoryLoading(false);
    }
  };
  const fetchFilteredCategories = async (shopId) => {
    try {
      setCartLoading(true);
      await BaseClient.get(
        APIEndpoints.getFilteredCategory + `/${shopId}`,
        [],
        {
          onSuccess: (res) => {
            setCategoryList(res?.data?.data?.items);
          },
          onFailed: (err) => {
            console.log("Error on fetching menus", err);
          },
        }
      );
    } catch (e) {
    } finally {
      setCartLoading(false);
    }
  };
  const fetchCartList = async (userId) => {
    try {
      setCartLoading(true);
      const userIdd = getLocalStorageItem("UserPersistent");
      let headers = {
        User: userId ?? userIdd,
      };

      await BaseClient.get(APIEndpoints.getCartItems, null, {
        headers,
        onSuccess: (res) => {
          setCartItems(res?.data?.data?.data);
        },
        onFailed: (err) => {
          console.log("Error on fetching menus", err);
        },
      });
    } catch (e) {
    } finally {
      setCartLoading(false);
    }
  };
  const addToCart = async (payload, { onSuccess, onFailed, headers }) => {
    try {
      setCartLoading(true);
      await BaseClient.post(APIEndpoints.cartCreation, payload, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setCartLoading(false);
    }
  };
  const getLocation = async (origin, destination) => {
    try {
      setMenuLoading(true);
      const response = await new Promise((resolve, reject) => {
        BaseClient.get(
          `${APIEndpoints.locationSettings}/delivery?origins=${origin}&destinations=${destination}&units=matrix`,
          null,
          {
            onSuccess: (res) => {
              setLocationResponse(res?.data?.data);
            },
            onFailed: (err) => {
              console.log("Error on fetching menus", err);
              reject(err);
            },
          }
        );
      });

      return response;
    } finally {
      setMenuLoading(false);
    }
  };
  const getShopSettings = async () => {
    try {
      setSettingsLoading(true);
      await BaseClient.get(APIEndpoints.shopSettings, [], {
        onSuccess: (res) => {
          console.log("settings", res.data.data);

          setSettings(res?.data?.data);
          setDeliveryInfo(res?.data?.data?.deliveryInfo);
        },
        onFailed: (err) => {
          console.log("Error on fetching menus", err);
        },
      });
    } finally {
      setSettingsLoading(false);
    }
  };
  const fetchProductsList = async (data) => {
    try {
      setMenuLoading(true);
      const response = await new Promise((resolve, reject) => {
        BaseClient.get(
          APIEndpoints.productList +
            `/${data?.shopId}` +
            `/${data?.categoryId}`,
          null,
          {
            onSuccess: (res) => {
              const items = res?.data?.data?.items;
              resolve(items);
            },
            onFailed: (err) => {
              console.log("Error on fetching menus", err);
              reject(err);
            },
          }
        );
      });

      return response;
    } finally {
      setMenuLoading(false);
    }
  };

  const clearCartItems = async (id, { onSuccess, onFailed }) => {
    try {
      setCartLoading(true);
      const userIdd = getLocalStorageItem("UserPersistent");
      let headers = {
        User: id ?? userIdd,
      };
      await BaseClient.delete(APIEndpoints.clearCart, {
        onSuccess: onSuccess,
        onFailed: onFailed,
        headers,
      });
    } finally {
      setCartLoading(false);
    }
  };

  return {
    fetchMenuList,
    fetchCategoriesList,
    fetchProductsList,
    menuList,
    categoryList,
    menuLoading,
    addToCart,
    fetchCartList,
    fetchFilteredCategories,
    cartItems,
    getLocation,
    locationResponse,
    deliveryFee,
    setDeliveryFee,
    deleteSingleCartItem,
    cartLoading,
    getShopSettings,
    settings,
    deliveryInfo,
    categoryLoading,
    settingsLoading,
    setCartItems,
    clearCartItems,
    fetchCurrentShopStatus,
    currentStatus,
  };
};

export default useMenus;
