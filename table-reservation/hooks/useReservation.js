import React, { useState } from "react";
import BaseClient from "../helper/Baseclient";
import { ReservationAPIEndpoints } from "../constants/ReservationAPIEndpoints";
import { APIEndpoints } from "../../order-online-page/constants/APIEndpoints";

const useReservation = () => {
  const [shopTiming, setShopTiming] = useState(null);
  const [isTimingLoading, setIsTimingLoading] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [chatMessages, setChatMessages] = useState(null);
  const [messageLoading, setMessageLoading] = useState(false);

  const sendReservationOTP = async (
    payload,
    { onSuccess, onFailed, headers }
  ) => {
    try {
      setReservationLoading(true);
      await BaseClient.post(
        ReservationAPIEndpoints.sendReservationOTP,
        payload,
        {
          onSuccess: onSuccess,
          onFailed: onFailed,
          headers: headers,
        }
      );
    } finally {
      setReservationLoading(false);
    }
  };

  const getShopTiming = async (shopId) => {
    try {
      setIsTimingLoading(true);
      await BaseClient.get(
        ReservationAPIEndpoints.shopTiming + `/${shopId}`,
        [],
        {
          onSuccess: (res) => {
            if (res && res.data && res.data.data) {
              setShopTiming(res.data.data);
            }
          },
          onFailed: (err) => {
            console.log("ERROR ON GETTING SHOP TIMING", err);
          },
        }
      );
    } finally {
      setIsTimingLoading(false);
    }
  };
  const completeReservation = async (
    payload,
    { onSuccess, onFailed, headers }
  ) => {
    try {
      setReservationLoading(true);
      await BaseClient.post(ReservationAPIEndpoints.newReservation, payload, {
        onSuccess: onSuccess,
        onFailed: onFailed,
        headers: headers,
      });
    } finally {
      setReservationLoading(false);
    }
  };

  const getReservationDetails = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        setReservationLoading(true);
        const headers = {
          "x-secretkey": process.env.FOODPAGE_RESERVATION_SECRET_KEY,
        };

        await BaseClient.get(
          ReservationAPIEndpoints.fetchReservationDetails + `/${id}`,
          [],
          {
            headers: headers,
            onSuccess: (res) => {
              if (res && res.data && res.data.error == false && res.data.data) {
                // debugger;
                const reservResponse = res.data.data?.ReservationData;
                const msgResponse = res.data.data?.chatMessages;

                if (reservResponse) {
                  setReservationDetails(reservResponse);
                  setChatMessages(msgResponse);
                  resolve(res.data.data?.ReservationData);
                } else {
                  let errResp = {
                    error: true,
                    message: res?.data?.data?.message,
                  };
                  resolve(errResp);
                }
              }
            },
            onFailed: (err) => {
              reject(err);
              console.log("ERROR ON GETTING SHOP TIMING", err);
            },
          }
        );
      } finally {
        setReservationLoading(false);
      }
    });
  };

  const cancelReservation = async (id, { onSuccess, onFailed }) => {
    try {
      setReservationLoading(true);
      const headers = {
        "x-secretkey": process.env.FOODPAGE_RESERVATION_SECRET_KEY,
      };
      await BaseClient.put(
        `${ReservationAPIEndpoints.cancelReservation}/${id}`,
        {},
        {
          headers: headers,
          onSuccess: onSuccess,
          onFailed: onFailed,
        }
      );
    } finally {
      setReservationLoading(false);
    }
  };

  const updateReservationDetails = async (payload, { onSuccess, onFailed }) => {
    try {
      setReservationLoading(true);
      const { uniqId, ...rest } = payload;
      const headers = {
        "x-secretkey": process.env.FOODPAGE_RESERVATION_SECRET_KEY,
      };
      await BaseClient.put(
        `${ReservationAPIEndpoints.updateReservation}/${uniqId}`,
        rest,
        {
          headers: headers,
          onSuccess: onSuccess,
          onFailed: onFailed,
        }
      );
    } finally {
      setReservationLoading(false);
    }
  };

  const sendMessage = async (payload, { onSuccess, onFailed, headers }) => {
    try {
      setMessageLoading(true);

      await BaseClient.post(
        ReservationAPIEndpoints.sendMessageToShop,
        payload,
        {
          onSuccess: onSuccess,
          onFailed: onFailed,
          headers: headers,
        }
      );
    } finally {
      setMessageLoading(false);
    }
  };
  return {
    getShopTiming,
    shopTiming,
    isTimingLoading,
    reservationLoading,
    sendReservationOTP,
    completeReservation,
    getReservationDetails,
    reservationDetails,
    cancelReservation,
    updateReservationDetails,
    chatMessages,
    sendMessage,
    messageLoading
  };
};

export default useReservation;
