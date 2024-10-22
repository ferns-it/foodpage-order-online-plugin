"use client";

import React, { createContext, useEffect, useState } from "react";
import useReservation from "../hooks/useReservation";
import useLocalStorage from "../hooks/useLocalStorage";

export const TableReservationContext = createContext();

export const TableReservationContextProvider = (props) => {
  const [oneTimePass, setOneTimePass] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    bookingTime: "",
    bookingDate: "",
    noOfChairs: 0,
    message: "",
  });
  // const [otp, setOtp, clearOtp] = useLocalStorage('userOTP', '');

  const {
    getShopTiming,
    shopTiming,
    isTimingLoading,
    reservationLoading,
    sendReservationOTP,
    completeReservation,
    getReservationDetails,
    reservationDetails,
  } = useReservation();

  useEffect(() => {
    const shopId = process.env.SHOP_ID;
    if (shopId && shopId != 0) {
      getShopTiming(shopId);
    }
  }, []);

  return (
    <TableReservationContext.Provider
      value={{
        getShopTiming,
        shopTiming,
        isTimingLoading,
        reservationLoading,
        sendReservationOTP,
        initialValues,
        setInitialValues,
        oneTimePass,
        setOneTimePass,
        secretKey,
        setSecretKey,
        completeReservation,
        getReservationDetails,
        reservationDetails,
        // otp,
        // setOtp,
        // clearOtp
      }}
    >
      {props.children}
    </TableReservationContext.Provider>
  );
};
