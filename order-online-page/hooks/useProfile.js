"use client";
import React, { useState } from "react";
import BaseClient from "../helper/Baseclients";
import { APIEndpoints } from "../constants/APIEndpoints";

const useProfile = () => {
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userAddressList, setUserAddressList] = useState(null);

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
            console.log("Error on address list", err);
          },
        }
      );
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
            console.log("Error on address list", err);
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
    { onSuccess, onFailed, headers }
  ) => {
    try {
      setAddressLoading(true);
      await BaseClient.put(APIEndpoints.getDefaultAddress + `/${addressId}`, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
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
    fetchAddressList,
    userAddressList,
  };
};

export default useProfile;
