import React, { useState } from "react";
import BaseClient from "../helper/Baseclient";
import { APIEndpoints } from "../constants/OrderOnlineAPIEndpoints";

const useMenus = () => {
  const [menuList, setMenuList] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [productsList, setProductList] = useState([]);
  const [cartItems, setCartItems] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [locationResponse, setLocationResponse] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [categoryLoading, setcategoryLoading] = useState(false);
  const [responseError, setResponseError] = useState(null);

  const fetchMenuList = async (shopId) => {
    try {
      if (!shopId) {
        console.log("ShopId is undefined!");
        return;
      }
      setMenuLoading(true);
      console.log(menuLoading);
      await BaseClient.get(APIEndpoints.menulist + `/${shopId}/0`, [], {
        onSuccess: (res) => {
          console.log("menu-response", res.data);
          setMenuList(res?.data);
        },
        onFailed: (err) => {
          setResponseError(err);
          console.log("Error on fetching menus", err);
        },
      });
    } finally {
      setMenuLoading(false);
    }
  };
  const fetchCategoriesList = async (shopId) => {
    try {
      setcategoryLoading(true);

      await BaseClient.get(APIEndpoints.categoryList, [], {
        onSuccess: (res) => {
          console.log("category-response", res.data);
          setCategoryList(res?.data?.data?.items);
        },
        onFailed: (err) => {
          console.log("Error on fetching menus", err);
        },
      });
    } finally {
      setcategoryLoading(false);
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

  // const getLocation = async (origin, destination) => {
  //   try {
  //     console.log(origin, destination);
  //     setMenuLoading(true);
  //     const response = await new Promise((resolve, reject) => {
  //       BaseClient.get(
  //         `${APIEndpoints.locationSettings}/delivery?origins=${origin}&destinations=${destination}&units=matrix`,
  //         null,
  //         {
  //           onSuccess: (res) => {
  //             resolve(res.data);
  //           },
  //           onFailed: (err) => {
  //             console.log("Error on fetching menus", err);
  //             reject(err);
  //           },
  //         }
  //       );
  //     });
  //     setLocationResponse(response);
  //     return response;
  //   } finally {
  //     setMenuLoading(false);
  //   }
  // };

  const deleteCartItem = async (id, { onSuccess, onFailed }) => {
    try {
      setSettingsLoading(true);

      await BaseClient.delete(APIEndpoints.deleteCartItem + `/${id}`, {
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setSettingsLoading(false);
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
    locationResponse,
    deleteCartItem,
    responseError,
    settingsLoading,
    categoryLoading,
  };
};

export default useMenus;
