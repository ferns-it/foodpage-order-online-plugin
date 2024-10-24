"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CryptoJS from "crypto-js";
import Utils from "../_utils/Utils";

import { useRouter } from "next/navigation";
import { AppContext } from "../order-online-page/context/index";
import "./style.css";

function GuestLogin() {
  const router = useRouter();
  const [loginInfo, setLoginInfo] = useState("guest");
  const [userState, setUserState] = useState({
    userName: "",
    password: "",
    guestName: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    userName: "",
    password: "",
    guestName: "",
    email: "",
  });

  useEffect(() => {
    sessionStorage.setItem("userInfo", loginInfo);
  }, [loginInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const { userLoading, sentOTPtoUser, settings, authLoading } =
    useContext(AppContext);

  const encryptToMD5 = (number) => {
    return CryptoJS.MD5(number).toString();
  };

  const validateGuestForm = () => {
    let valid = true;
    let errors = {};

    if (!userState.guestName) {
      valid = false;
      errors.guestName = "Full Name is required.";
    }
    if (!userState.email) {
      valid = false;
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(userState.email)) {
      valid = false;
      errors.email = "Email address is invalid.";
    }

    setErrors(errors);
    return valid;
  };

  const handleGuestSubmit = async () => {
    const otp = Utils.generateOTP();

    const encryptedOTP = encryptToMD5(otp);
    sessionStorage.setItem("encryptedOTP", encryptedOTP);
    sessionStorage.setItem("loginMail", userState.email);
    sessionStorage.setItem("name", userState.guestName);
    const shopName = settings?.name;

    if (validateGuestForm()) {
      const data = {
        shopName: shopName,
        customerName: userState.guestName,
        useremailid: userState.email,
        FPsecretkey: process.env.FOODPAGE_SECRET_KEY,
        otp: otp,
      };
      await sentOTPtoUser(data, {
        onSuccess: async (res) => {
          if (res?.data?.error == true) {
            toast.error(res.errorMessage.message);
          } else {
            toast.success("OTP Sended Successfully!");
            router.push("/otpverification");
          }
        },
        onFailed: (err) => {
          console.log(err);
          const errMsg = err?.errorMessage?.message ?? "FAILED TO SEND OTP!";
          toast.error(errMsg);
        },
      });
    }
  };

  return (
    <Fragment>
      <div className="login_wrapper row">
        <div className="card login_comp col-md-4 col-lg-3 col-sm-12 mx-auto">
          <h2>Guest Login</h2>
          <p className="sub_title_login">
            Please fill below fields to continue as a Guest
          </p>
          <div className="container">
            <form action="" onSubmit={handleGuestSubmit}>
              <div className="form-group">
                <div className="form-label orderOnline_label">Full Name</div>
                <input
                  type="text"
                  name="guestName"
                  id=""
                  className="form-control"
                  value={userState.guestName}
                  onChange={handleInputChange}
                />
                {errors.guestName && (
                  <p className="error">{errors.guestName}</p>
                )}
              </div>
              <div className="form-group my-4">
                <div className="form-label orderOnline_label">Email</div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control password_inp"
                  value={userState.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <button
                type="button"
                className="login_btn"
                onClick={handleGuestSubmit}
                disabled={authLoading}
              >
                Continue
              </button>
            </form>
          </div>
          {/* <p className="or_">or</p>
          <button
            type="button"
            className="guest_btn"
            onClick={() => setLoginInfo("login")}
          >
            SignIn
          </button> */}
        </div>
      </div>
    </Fragment>
  );
}

export default GuestLogin;
