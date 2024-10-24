"use client";
import { AppContext } from "../order-online-page/context/index";
import React, { Fragment, useContext, useState } from "react";
import OTPInput from "react-otp-input";
import * as Go from "react-icons/go";
import CryptoJS from "crypto-js";
import toast, { Toaster } from "react-hot-toast";
import Utils from "../_utils/Utils";
import { useRouter } from "next/navigation";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from "../_utils/ClientUtils";
import "./style.css";

function OtpVerification() {
  const { authLoading, settings, sentOTPtoUser } = useContext(AppContext);
  const router = useRouter();
  const [reservOTP, setResertOTP] = useState("");
  const encryptedOTP = getSessionStorageItem("encryptedOTP");

  const encryptToMD5 = (number) => {
    return CryptoJS.MD5(number).toString();
  };

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
      sessionStorage.removeItem("encryptedOTP");
      sessionStorage.removeItem("loginInfo");
      const pathname = getLocalStorageItem("path") ?? "/checkout";
      removeLocalStorageItem("path");
      router.push(pathname);
    } else {
      toast.error("invalid OTP!");
      setResertOTP("");
    }
  };

  const loginedMail  = getSessionStorageItem("loginMail") ?? ""

  return (
    <section className="table_reserv__">
      <div className="container">
        <div className="card table_reservation_card col-lg-7 col-md-9 col-sm-10 mb-3">
          <h3 className="table-reservation-form-head">OTP VERIFICATION </h3>
          <p className="table_reserv_info_sub_head text-center">
            Your OTP has been send to your mail addesss{" "}
            <span>{loginedMail}</span>
          </p>
          <div className="otp_validation_reserv">
            <OTPInput
              value={reservOTP}
              onChange={(e) => setResertOTP(e)}
              numInputs={6}
              renderSeparator={<span>-</span>}
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
      </div>
    </section>
  );
}

export default OtpVerification;
