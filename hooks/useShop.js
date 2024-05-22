import { useEffect, useState } from "react";
import { APIEndpoints } from "../constants/APIEndpoints";
import BaseClient from "../helper/Baseclient";

const useShop = () => {
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoaiding] = useState(false);

  const getShopSettings = async (shopUrl) => {
    try {
      setSettingsLoaiding(true);
      console.log(shopUrl, "url");
      await BaseClient.get(APIEndpoints.shopSettings + `/${shopUrl}`, [], {
        onSuccess: (res) => {
          setSettings(res?.data?.data);
          console.log(res.data, "settings");
        },
        onFailed: (err) => {
          console.log("Error on fetching menus", err);
        },
      });
    } finally {
      setSettingsLoaiding(false);
    }
  };

  return {
    settings,
    getShopSettings,
    settingsLoading,
  };
};
export default useShop;
