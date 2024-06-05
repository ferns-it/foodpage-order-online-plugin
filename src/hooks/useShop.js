import { useEffect, useState } from "react";
import { APIEndpoints } from "../constants/OrderOnlineAPIEndpoints";
import BaseClient from "../helper/Baseclient";

const useShop = () => {
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoaiding] = useState(false);

  const getShopSettings = async () => {
    try {
      setSettingsLoaiding(true);
      await BaseClient.get(APIEndpoints.shopSettings, [], {
        onSuccess: (res) => {
          setSettings(res?.data?.data);
        },
        onFailed: (err) => {
          console.log("Error on fetching menus", err);
        },
      });
    } finally {
      setSettingsLoaiding(false);
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
    settings,
    getShopSettings,
    settingsLoading,
    deleteCartItem,
  };
};
export default useShop;
