"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import * as Go from "react-icons/go";
import Image from "next/image";
import CryptoJS from "crypto-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from "../../_utils/ClientUtils";
import { AppContext } from "../context";
import Utils from "../utils/Utils";

function OTPComp() {
  const { sentOTPtoUser, settings, authLoading, registerUser } =
    useContext(AppContext);
  const [reservOTP, setResertOTP] = useState("");
  const registerForm = getSessionStorageItem("register");
  const loginMail = getSessionStorageItem("loginMail");
  const encryptedOTP = getSessionStorageItem("encryptedOTP");
  const [initialState, setInitialState] = useState(null);

  const encryptToMD5 = (number) => {
    return CryptoJS.MD5(number).toString();
  };
  const router = useRouter();
  useEffect(() => {
    setInitialState(JSON.parse(registerForm));
  }, []);

  const resendOTP = async () => {
    const otp = Utils.generateOTP();
    const encryptedOTP = encryptToMD5(otp);
    setSessionStorageItem("encryptedOTP", encryptedOTP);
    const initialState = JSON.parse(registerForm);
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
          setSessionStorageItem("register", JSON.stringify(initialState));
          setSessionStorageItem("loginMail", initialState?.email);
          setSessionStorageItem("name", initialState?.userFirstName);
          toast.success("OTP Sended Successfully!");
          router.push("/registerotpverification");
        }
      },
      onFailed: (err) => {
        const errMsg = err?.errorMessage?.message ?? "FAILED TO SEND OTP!";
        toast.error(errMsg);
      },
    });
  };

  const handleRegister = async () => {
    const payload = {
      shopID: process.env.SHOP_ID,
      userFirstName: initialState.userFirstName,
      userLastName: initialState.userLastName,
      userPostCode: initialState.userAddress.postalcode,
      userMobile: initialState.mobile,
      userEmail: initialState.email,
      userPassword: initialState.userPassword,
      userAddress: {
        line1: initialState.userAddress.line,
        line2: initialState.userAddress.line2,
        town: initialState.userAddress.town,
        postalcode: initialState.userAddress.postalcode,
        county: initialState.userAddress.county,
        landmark: initialState.userAddress.landmark,
      },
    };
    await registerUser(payload, {
      onSuccess: (res) => {
        if (res.data.error == true) {
          toast.error(res.data.errorMessage.message || "Something Went Wrong!");
        }
        if (res.data.error == false) {
          generateToken();
          toast.success("User Registered Successfully!");
          router.push("/login");
        }
      },
      onFailed: (err) => {
        toast.error(
          err.response.data.errorMessage.message ||
            err.message ||
            "Something Went Wrong!"
        );
      },
    });
  };
  const generateToken = () => {
    const data = {
      name: getSessionStorageItem("name"),
      email: getSessionStorageItem("loginMail"),
      role: "user",
    };
    const payload = { data };

    const header = {
      alg: "FP2024",
      typ: "JWT",
      // exp: Math.floor(Date.now() / 1000) + (60), //! one min
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, //! one day
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

      handleRegister();
      removeSessionStorageItem("encryptedOTP");
      removeSessionStorageItem("loginInfo");
      // const pathname = getLocalStorageItem("path") ?? "/checkout";
      removeLocalStorageItem("path");
      // router.push(pathname);
    } else {
      toast.error("invalid OTP!");
      setResertOTP("");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="pt-50 section-title-area text-center">
            <Image src={Logo} height={0} width={350} layout="contain" />
          </div>
        </div>
      </div>
      <section className="table_reserv__">
        <div className="container">
          <div className="card table_reservation_card col-lg-7 col-md-9 col-sm-10 mb-3">
            <h3 className="table-reservation-form-head text-center">
              OTP VERIFICATION{" "}
            </h3>
            <p className="table_reserv_info_sub_head text-center">
              Your OTP has been send to your mail addesss{" "}
              <span>{loginMail}</span>
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
                  <span onClick={resendOTP} type="button">
                    Resend OTP
                  </span>
                ) : (
                  <span className="cursor__">Loading...</span>
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
    </div>
  );
}

export default OTPComp;
