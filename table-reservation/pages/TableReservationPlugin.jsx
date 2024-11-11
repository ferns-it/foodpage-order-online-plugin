"use client";

import React, { useState } from "react";
import TableReservationForm from "../components/TableReservationForm";
import ReservOtp from "../components/ReservOTP";
import CryptoJS from "crypto-js";
import { Toaster } from "react-hot-toast";
import ReservSuccess from "../components/ReservSuccess";
import "../../table-reservation/style/style.css";

function TableReservationPlugin(props) {
  const [isActiveTablePage, setIsActiveTablePage] =
    useState("reservation-form");
  const shopId = process.env.SHOP_ID;

  const encryptToMD5 = (number) => {
    return CryptoJS.MD5(number).toString();
  };
  return (
    <div>
      <Toaster />
      <section className="table_reservation_form_page">
        {isActiveTablePage === "reservation-form" ? (
          <TableReservationForm
            shopId={shopId}
            setIsActiveTablePage={setIsActiveTablePage}
            encryptToMD5={encryptToMD5}
          />
        ) : isActiveTablePage === "otp-page" ? (
          <ReservOtp
            setIsActiveTablePage={setIsActiveTablePage}
            encryptToMD5={encryptToMD5}
            shopId={shopId}
          />
        ) : (
          isActiveTablePage === "success-page" && <ReservSuccess />
        )}
      </section>
    </div>
  );
}

export default TableReservationPlugin;
