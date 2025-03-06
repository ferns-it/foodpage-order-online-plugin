"use client";

import React, { Fragment, useContext, useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import * as Go from "react-icons/go";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import toast, { Toaster } from "react-hot-toast";

import { useRouter } from "next/navigation";

import { MdTableBar } from "react-icons/md";
import { AppContext } from "../../order-online-page/context";
import { TableReservationContext } from "../context/TableReservationContext";
import Utils from "../utils/Utils";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from "../../_utils/ClientUtils";
import { jwtDecode } from "jwt-decode";

function ReservationGuestOTP() {
  const { authLoading, settings, sentOTPtoUser } = useContext(AppContext);
  const {
    initialValues,
    completeReservation,
    reservationLoading,
    secretKey,
    setSecretKey,
    sendReservationOTP,
    setInitialValues,
  } = useContext(TableReservationContext);
  const router = useRouter();
  const [reservOTP, setResertOTP] = useState("");
  const encryptedOTP = getSessionStorageItem("encryptedOTP");

  const encryptToMD5 = (number) => {
    return CryptoJS.MD5(number).toString();
  };
  const emptyFieldsData = () => {
    let emptyFields = [];
    for (const key in initialValues) {
      if (
        typeof initialValues[key] !== "string" ||
        initialValues[key].trim() === ""
      ) {
        emptyFields.push(key);
      }
    }

    return emptyFields;
  };
  useEffect(() => {
    const emptyFields = emptyFieldsData();

    if (emptyFields && emptyFields.length != 0) {
      const reservData = getSessionStorageItem("reserv_details");
      const parsedData =
        reservData && typeof reservData === "string" && JSON.parse(reservData);

      if (!parsedData) return;

      setInitialValues(parsedData);
    }
  }, []);
  const resendOTP = async () => {
    const otp = Utils.generateOTP();
    const encryptedOTP = encryptToMD5(otp);
    setSessionStorageItem("encryptedOTP", encryptedOTP);
    const shopName = settings?.name;

    const data = {
      shopName: shopName,
      customerName: getSessionStorageItem("name"),
      useremailid: getSessionStorageItem("loginMail"),
      FPsecretkey: process.env.FOODPAGE_SECRET_KEY,
      otp: otp,
    };
    await sentOTPtoUser(data, {
      onSuccess: async (res) => {
        if (res?.data?.error == true) {
          toast.error(res.errorMessage.message);
        } else {
          toast.success("OTP Sended Successfully!");
        }
      },
      onFailed: (err) => {
        console.log(err);
        const errMsg = err?.errorMessage?.message ?? "FAILED TO SEND OTP!";
        toast.error(errMsg);
      },
    });
  };
  const generateToken = () => {
    const data = {
      name: getSessionStorageItem("name"),
      email: getSessionStorageItem("loginMail"),
      role: "guest",
    };
    const payload = { data };

    const header = {
      alg: "FP2024",
      typ: "JWT",
    };
    const encodedHeaders = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const jwt = `${encodedHeaders}.${encodedPayload}`;
    setLocalStorageItem("userToken", jwt);
  };
  const validateOTP = () => {
    const changedOtp = encryptToMD5(reservOTP);
    // console.log(encryptedOTP, changedOtp);
    // console.log(changedOtp, "chanes");
    if (changedOtp === encryptedOTP) {
      toast.success("OTP is Verified Successfully!!");
      generateToken();
      completeNewReservation();
      sessionStorage.removeItem("encryptedOTP");
      sessionStorage.removeItem("loginInfo");
    } else {
      toast.error("invalid OTP!");
      setResertOTP("");
    }
  };
  const completeNewReservation = async () => {
    const mergedBooking = Utils.mergeBookingDateTime(
      initialValues?.bookingDate,
      initialValues?.bookingTime
    );

    const token = getLocalStorageItem("userToken");
    const tokenData = jwtDecode(token);
    const userId = tokenData?.data?.userID ?? 0;

    const payload = {
      shopID: process.env.SHOP_ID,
      userID: userId,
      name: initialValues?.name,
      phone: initialValues?.phone,
      email: initialValues?.email,
      totalChair: initialValues?.noOfChairs,
      reservationDateTime: mergedBooking,
      advancePayment: "No",
      advanceAmount: "",
      paymentMethod: "",
      transactionID: "",
      message: initialValues?.message,
      baseUrl: process.env.TABLE_RESERVATION_URL,
      source: "NextJs",
    };

    const headers = {
      "x-secretkey": process.env.FOODPAGE_RESERVATION_SECRET_KEY,
    };

    await completeReservation(payload, {
      onSuccess: (res) => {
        removeSessionStorageItem("reserv_details");
        removeLocalStorageItem("userToken");
        removeLocalStorageItem("userToken");
        removeSessionStorageItem("reservationData");
        setTimeout(() => {
          router.push("/reserv-success");
        }, 1000);
      },
      onFailed: (err) => {
        toast.error("Failed to complete reservation!");
      },
      headers,
    });
  };
  return (
    <section className="table_reserv__">
      <div className="container">
        <div className="row">
          <div className="card table_reservation_card col-lg-8 col-md-9 col-sm-10 mb-3">
            <h3 className="table-reservation-form-head">OTP VERIFICATION </h3>
            <p className="table_reserv_info_sub_head text-center">
              Your OTP has been send to your mail addesss{" "}
              <span>{initialValues?.email ?? "N/A"}</span>
            </p>
            <div className="otp_validation_reserv">
              <OTPInput
                value={reservOTP}
                onChange={(e) => setResertOTP(e)}
                numInputs={6}
                renderSeparator={<span>-</span>}
                className="inputs"
                renderInput={(props) => <input {...props} />}
              />
              <p className="resend_otp_reservv">
                Didn't get any OTP? <br />
                {!authLoading ? (
                  <span onClick={resendOTP}>Resend OTP</span>
                ) : (
                  <span
                    style={{
                      userSelect: "none",
                      cursor: "not-allowed",
                      textDecoration: "none",
                    }}
                  >
                    Loading...
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              className="reserv_otp_validation_btn mb-3"
              onClick={validateOTP}
              disabled={authLoading}
            >
              {authLoading === false ? (
                <Fragment>
                  <span>Continue</span>
                  <i className="ps-2">
                    <Go.GoArrowRight />
                  </i>
                </Fragment>
              ) : (
                <Fragment>
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                  ></div>
                  <span className="sr-only ps-2">Loading...</span>
                </Fragment>
              )}
            </button>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card timing_card_table_reserv ">
              <p className="open_">
                <i className="pe-1">
                  <MdTableBar />
                </i>
                <span>Reservation Details</span>
              </p>
              <table className="reserv_timing_table table">
                <tbody>
                  <tr>
                    <td className="tbl_head">Booking Date</td>
                    <td>
                      {initialValues && initialValues?.bookingDate
                        ? Utils.formatDate(initialValues?.bookingDate)
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="tbl_head">Booking Time</td>
                    <td>{initialValues?.bookingTime ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="tbl_head">Name</td>
                    <td>{initialValues?.name ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="tbl_head">Email Address</td>
                    <td>{initialValues?.email ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="tbl_head">Phone</td>
                    <td>{initialValues?.phone ?? "N/A"}</td>
                  </tr>

                  <tr>
                    <td className="tbl_head">people</td>
                    <td>{initialValues?.noOfChairs ?? "N/A"}</td>
                  </tr>
                  {initialValues && initialValues.message && (
                    <tr>
                      <td className="tbl_head">Message</td>
                      <td>{initialValues?.message ?? "N/A"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReservationGuestOTP;
