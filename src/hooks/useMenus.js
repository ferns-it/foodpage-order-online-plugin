import React, { useState } from "react";
import BaseClient from "../helper/Baseclient";
import { APIEndpoints } from "../constants/APIEndpoints";

const useMenus = () => {
  const [menuList, setMenuList] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);

  const fetchMenuList = async () => {
    try {
      setMenuLoading(true);
      await BaseClient.get(APIEndpoints.menulist, {
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
  return {
    fetchMenuList,
    menuList,
    menuLoading,
  };
};

export default useMenus;
