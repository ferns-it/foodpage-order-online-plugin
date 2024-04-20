import React, { useState } from "react";
import BaseClient from "../helper/Baseclient";
import { APIEndpoints } from "../constants/APIEndpoints";

const useMenus = () => {
  const [menuList, setMenuList] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [productsList, setProductList] = useState([]);

  const fetchMenuList = async () => {
    try {
      setMenuLoading(true);
      await BaseClient.get(APIEndpoints.menulist, [], {
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
          null, // No need to pass payload here
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
  return {
    fetchMenuList,
    fetchCategoriesList,
    fetchProductsList,
    menuList,
    categoryList,
    productsList,
    menuLoading,
  };
};

export default useMenus;
