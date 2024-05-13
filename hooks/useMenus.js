import React, { useState } from "react";
import BaseClient from "../helper/Baseclient";
import { APIEndpoints } from "../constants/APIEndpoints";

const useMenus = () => {
  const [menuList, setMenuList] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [productsList, setProductList] = useState([]);
  const [cartItems, setCartItems] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [locationResponse, setLocationResponse] = useState(null);

  const fetchMenuList = async (shopId) => {
    try {
      setMenuLoading(true);
      await BaseClient.get(APIEndpoints.menulist + `/${shopId}/0`, [], {
        onSuccess: (res) => {
          console.log(res.data.data);
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
  const fetchCategoriesList = async () => {
    try {
      setMenuLoading(true);
      await BaseClient.get(APIEndpoints.categoryList, [], {
        onSuccess: (res) => {
          console.log(res?.data?.data?.items);
          setCategoryList(res?.data?.data?.items);
        },
        onFailed: (err) => {
          console.log("Error on fetching menus", err);
        },
      });
    } finally {
      setMenuLoading(false);
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

  const addToCart = async (payload, { onSuccess, onFailed }) => {
    try {
      setCartLoading(true);
      await BaseClient.post(APIEndpoints.cartCreation, payload, {
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setCartLoading(false);
    }
  };

  const fetchCartList = async () => {
    try {
      setMenuLoading(true);
      await BaseClient.get(APIEndpoints.getCartItems, [], {
        onSuccess: (res) => {
          setCartItems(res?.data?.data?.data);
        },
        onFailed: (err) => {
          console.log("Error on fetching menus", err);
        },
      });
    } finally {
      setMenuLoading(false);
    }
  };

  const deleteSingleCartItem = async (id, { onSuccess, onFailed }) => {
    try {
      setCartLoading(true);
      await BaseClient.delete(APIEndpoints.deleteCartItem + `/${id}`, {
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
  const deleteCartItem = async (id, { onSuccess, onFailed }) => {
    try {
      setSettingsLoaiding(true);

      await BaseClient.delete(APIEndpoints.deleteCartItem + `/${id}`, {
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setSettingsLoaiding(false);
    }
  };

  return {
    fetchMenuList,
    fetchCategoriesList,
    fetchProductsList,
    menuList,
    categoryList,
    productsList,
    menuLoading,
    addToCart,
    fetchCartList,
    cartItems,
    cartLoading,
    deleteSingleCartItem,
    getLocation,
    locationResponse,
    deleteCartItem
  };
};

export default useMenus;
