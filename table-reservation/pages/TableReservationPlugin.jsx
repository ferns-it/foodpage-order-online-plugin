"use client";

import React, {useState} from "react";
import TableReservationForm from "../components/TableReservationForm";
import ReservOtp from "../components/ReservOTP";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import ReservSuccess from "../components/ReservSuccess";

function TableReservationPlugin(props) {
  const [isActiveTablePage, setIsActiveTablePage] =
    useState("reservation-form");
  const shopId = process.env.SHOP_ID;

  const encryptToMD5 = (number) => {
    return CryptoJS.MD5(number).toString();
  };

  return (
    <div className="main">
      {/* <Toaster /> */}

      {isActiveTablePage === "reservation-form" ? (
        <section className="table_reservation_form_page mt-3">
          <TableReservationForm
            shopId={shopId}
            setIsActiveTablePage={setIsActiveTablePage}
            encryptToMD5={encryptToMD5}
          />
        </section>

      ) : isActiveTablePage === "otp-page" ? (
        <ReservOtp
          setIsActiveTablePage={setIsActiveTablePage}
          encryptToMD5={encryptToMD5}
          shopId={shopId}
        />
      ) : (
        isActiveTablePage === "success-page" && <ReservSuccess />
      )}
    </div>
  );
}

export default TableReservationPlugin;
