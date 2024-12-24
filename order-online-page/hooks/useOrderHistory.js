import React, { useState } from "react";
import BaseClient from "../helper/Baseclients";
import { APIEndpoints } from "../constants/APIEndpoints";
import { getLocalStorageItem } from "@/plugin/_utils/ClientUtils";

const useOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderList, setOrderList] = useState(null);
  const fetchOrderHistory = async () => {
    const token = getLocalStorageItem("token");
    try {
      setOrderLoading(true);
      let headers = {
        "x-user": token,
      };
      await BaseClient.get(
        APIEndpoints.getOrderHistory,
        {},
        {
          headers,
          onSuccess: (res) => {
            if (res.data.data.History) {
              setOrderHistory(res.data.data.History);
            }
          },
          onFailed: (err) => {
            console.log("Error on address list", err);
          },
        }
      );
    } finally {
      setOrderLoading(false);
    }
  };
  const fetchOrderList = async (userToken) => {
    try {
      setOrderLoading(true);
      let headers = {
        "x-user": userToken,
      };
      await BaseClient.get(
        APIEndpoints.getOrderList,
        {},
        {
          onSuccess: (res) => {
            setOrderHistory(res?.data?.data?.History);
          },
          onFailed: (err) => {
            console.log("Error is fetched", err);
          },
          headers: headers,
        }
      );
    } finally {
      setOrderLoading(false);
    }
  };
  const fetchOrderDetails = async (userToken, orderId) => {
    try {
      setOrderLoading(true);
      let headers = {
        "x-user": userToken,
      };
      await BaseClient.get(
        APIEndpoints.getOrderDetails + `/${orderId}`,
        {},
        {
          onSuccess: (res) => {
            setOrderList(res?.data?.data);
          },
          onFailed: (err) => {
            console.log("Error is fetched", err);
          },
          headers: headers,
        }
      );
    } finally {
      setOrderLoading(false);
    }
  };
  return {
    fetchOrderList,
    orderLoading,
    orderHistory,
    fetchOrderDetails,
    orderList,
    fetchOrderHistory,
  };
};

export default useOrderHistory;
