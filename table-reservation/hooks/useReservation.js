import React, { useState } from "react";
import BaseClient from "../helper/Baseclient";
import { ReservationAPIEndpoints } from "../constants/ReservationAPIEndpoints";

const useReservation = () => {
  const [shopTiming, setShopTiming] = useState(null);
  const [isTimingLoading, setIsTimingLoading] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);

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
            console.log("response", res);

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
  return {
    getShopTiming,
    shopTiming,
    isTimingLoading,
    reservationLoading,
    sendReservationOTP,
    completeReservation,
  };
};

export default useReservation;
