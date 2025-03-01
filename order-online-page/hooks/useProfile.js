"use client";
import React, { useContext, useState } from "react";
import BaseClient from "../helper/Baseclients";
import { APIEndpoints } from "../constants/APIEndpoints";
import { AppContext } from "../context";
import { useRouter } from "next/navigation";
import { getLocalStorageItem } from "../../_utils/ClientUtils";

const useProfile = () => {
  const router = useRouter();
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [orderHistory, setOrderHistory] = useState(null);
  const [userOrderHistory, setUserOrderHistory] = useState(null);
  const [expired, setExpired] = useState(false);
  const [reservationList, setReservationList] = useState(null);
  const [userAddressList, setUserAddressList] = useState(null);
  const [tableReservationList, setTableReservationList] = useState(null);
  const fetchAddressList = async (token) => {
    try {
      setUserLoading(true);
      let headers = {
        "x-user": token,
      };
      await BaseClient.get(
        APIEndpoints.getAddressList,
        {},
        {
          headers,
          onSuccess: (res) => {
            if (res?.data?.data?.list) {
              setUserAddressList(res.data.data.list);
              return;
            }
            if (res?.data?.list) {
              setUserAddressList(res.data.list);
              return;
            }
          },
          onFailed: (err) => {
            if (err.response.data.code == 401) {
              localStorage.removeItem("userToken");
            }
          },
        }
      );
    } finally {
      setUserLoading(false);
    }
  };
  const setDefaultAddress = async (id, { onSuccess, onFailed, headers }) => {
    try {
      setUserLoading(true);
      await BaseClient.put(
        APIEndpoints.defaultAddress + `/${id}`,
        {},
        {
          headers: headers,
          onSuccess: onSuccess,
          onFailed: onFailed,
        }
      );
    } finally {
      setUserLoading(false);
    }
  };
  const fetchReservationData = async (token) => {
    try {
      setUserLoading(true);
      let headers = {
        "x-user": token,
      };
      await BaseClient.get(
        APIEndpoints.getReservationDetails,
        {},
        {
          headers,
          onSuccess: (res) => {
            if (res?.data?.error == false) {
              setReservationList(res.data.data?.ReservationList);
            } else {
              console.log("Error");
            }
          },
          onFailed: (err) => {
            if (err?.status == 401) {
              setExpired(true);
            }
          },
        }
      );
    } catch (e) {
    } finally {
      setUserLoading(false);
    }
  };

  const getUserInformation = async (token) => {
    try {
      setUserLoading(true);
      let headers = {
        "x-user": token,
      };
      await BaseClient.get(
        APIEndpoints.getAddressList,
        {},
        {
          headers,
          onSuccess: (res) => {
            if (res?.data?.error == false) {
              if (res?.data?.data?.list) {
                setUserInfo(res.data.data.list[0]);
                return;
              }
              if (res?.data?.list) {
                setUserInfo(res.data.list[0]);
                return;
              }
            } else {
              console.log("Error");
            }
          },
          onFailed: (err) => {
            if (err?.status == 401) {
              setExpired(true);
            }
          },
        }
      );
    } catch (e) {
    } finally {
      setUserLoading(false);
    }
  };
  const addNewAddress = async (payload, { onSuccess, onFailed, headers }) => {
    try {
      setAddressLoading(true);
      await BaseClient.post(APIEndpoints.addAddress, payload, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setAddressLoading(false);
    }
  };
  const deleteAddress = async (id, { onSuccess, onFailed, headers }) => {
    try {
      setAddressLoading(true);
      // debugger;
      await BaseClient.delete(APIEndpoints.deleteAddressList + `/${id}`, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setAddressLoading(false);
    }
  };

  const fetchDefaultAddress = async (
    addressId,
    { onSuccess, onFailed, headers } = {}
  ) => {
    try {
      setAddressLoading(true);
      await BaseClient.get(
        APIEndpoints.getDefaultAddress + `/${addressId}`,
        {},
        {
          headers: headers,
          onSuccess: onSuccess,
          onFailed: onFailed,
        }
      );
    } finally {
      setAddressLoading(false);
    }
  };

  const addressDetails = async (
    addressId,
    { onSuccess, onFailed, headers }
  ) => {
    try {
      setAddressLoading(true);

      await BaseClient.put(
        `${APIEndpoints.getDefaultAddress}/${addressId}`,
        null,
        {
          headers: headers,
          onSuccess: onSuccess,
          onFailed: onFailed,
        }
      );
    } finally {
      setAddressLoading(false);
    }
  };
  const fetchOrderHistory = async () => {
    const token = getLocalStorageItem("userToken");
    try {
      setUserLoading(true);
      let headers = {
        "x-user": token,
      };
      await BaseClient.get(
        APIEndpoints.getOrderHistory,
        {},
        {
          headers,
          onSuccess: (res) => {
            const data = res?.data?.data?.History;

            if (data && data.length != 0) {
              setUserOrderHistory(data);
            }
          },
          onFailed: (err) => {
            console.log("Error on address list", err);
          },
        }
      );
    } finally {
      setUserLoading(false);
    }
  };
  const fetchReservationList = async (token) => {
    try {
      setUserLoading(true);
      let headers = {
        "x-user": token,
      };
      await BaseClient.get(
        APIEndpoints.getReservationList + `/${process.env.SHOP_ID}` + "/all",
        {},
        {
          headers,
          onSuccess: (res) => {
            if (res?.data?.data?.enquiryList) {
              setTableReservationList(res.data.data.enquiryList);
              return;
            }
            if (res?.data?.enquiryList) {
              setTableReservationList(res.data.enquiryList);
              return;
            }
          },
          onFailed: (err) => {
            console.log("Error on address list", err);
          },
        }
      );
    } finally {
      setUserLoading(false);
    }
  };
  const userNewAddress = async (payload, { onSuccess, onFailed, headers }) => {
    try {
      setUserLoading(true);
      await BaseClient.post(APIEndpoints.addNewAddress, payload, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setUserLoading(false);
    }
  };
  const deleteSavedAddress = async (id, { onSuccess, onFailed, headers }) => {
    try {
      setUserLoading(true);
      await BaseClient.delete(APIEndpoints.deleteAddress + `/${id}`, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } catch (error) {
      onFailed(error);
    } finally {
      setUserLoading(false);
    }
  };
  return {
    fetchAddressList,
    address,
    addressLoading,
    addNewAddress,
    addressDetails,
    deleteAddress,
    fetchDefaultAddress,
    getUserInformation,
    userLoading,
    userInfo,
    userNewAddress,
    userAddressList,
    setUserInfo,
    expired,
    setDefaultAddress,
    deleteSavedAddress,
    userOrderHistory,
    fetchOrderHistory,
    fetchReservationData,
    reservationList,
    fetchReservationList,
    tableReservationList,
  };
};

export default useProfile;
