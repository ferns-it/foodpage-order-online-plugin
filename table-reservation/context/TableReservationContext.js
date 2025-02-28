"use client";

import React, { createContext, useEffect, useState } from "react";
import useReservation from "../hooks/useReservation";
import useLocalStorage from "../hooks/useLocalStorage";

export const TableReservationContext = createContext();

export const TableReservationContextProvider = (props) => {
  const [oneTimePass, setOneTimePass] = useState("");

  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableReservationSettings, setTableReservationSettings] =
    useState(null);

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    bookingTime: 0,
    bookingDate: "",
    noOfChairs: 0,
    message: "",
  });
  const [manageReservList, setManageReservList] = useState(null);
  // const [otp, setOtp, clearOtp] = useLocalStorage('userOTP', '');
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const shopid = process.env.SHOP_ID;

        const response = await fetch(
          `https://shopadmin.vgrex.com/settings/fetch-reservation-settings/${shopid}`
        );

        const json = await response.json();
        setTableReservationSettings(json?.data);
      } catch (err) {
        console.log(err, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const {
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
    messageLoading,
    getHolidays,
    upcomingHolidays,
    getReservationDetailsEmail,
    setReservationDetails,
  } = useReservation();

  useEffect(() => {
    const shopId = process.env.SHOP_ID;
    if (shopId && shopId != 0) {
      getShopTiming(shopId);
    }

    getHolidays();
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
        cancelReservation,
        updateReservationDetails,
        chatMessages,
        sendMessage,
        messageLoading,
        tableReservationSettings,
        loading,
        upcomingHolidays,
        getReservationDetailsEmail,
        setReservationDetails,
        manageReservList,
        setManageReservList,
        // otp,
        // setOtp,
        // clearOtp
      }}
    >
      {props.children}
    </TableReservationContext.Provider>
  );
};
