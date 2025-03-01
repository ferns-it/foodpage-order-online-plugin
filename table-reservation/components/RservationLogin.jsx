"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Fa6 from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

import { Tab } from "react-tabs";

import {
  getSessionStorageItem,
  getLocalStorageItem,
  redirectToLocation,
  removeSessionStorageItem,
  setLocalStorageItem,
} from "../../_utils/ClientUtils";
import { AppContext } from "../../order-online-page/context";
import { TableReservationContext } from "../context/TableReservationContext";
import Utils from "../utils/Utils";

function ReservationLogin() {
  const router = useRouter();
  const {
    authLoading,
    sentOTPtoUser,
    settings,
    userLogin,
    shopId,
    transferCartItem,
    setIsUserLogged,
  } = useContext(AppContext);
  const {
    initialValues,
    completeReservation,
    reservationLoading,
    secretKey,
    setSecretKey,
    sendReservationOTP,
    setInitialValues,
  } = useContext(TableReservationContext);
  const [showpass, setShowPass] = useState(false);
  const [loginInfo, setLoginInfo] = useState("guest");
  const [errors, setErrors] = useState({
    user: "",
    password: "",
    guestName: "",
    email: "",
  });
  const [userState, setUserState] = useState({
    user: "",
    password: "",
  });
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const validateLoginForm = () => {
    let valid = true;
    let errors = {};

    if (!userState.user) {
      valid = false;
      errors.userName = "Username is required.";
    }
    if (!userState.password) {
      valid = false;
      errors.password = "Password is required.";
    }

    setErrors(errors);
    return valid;
  };

  const transferCartItems = async (guestId, userId) => {
    const payload = {
      guestId,
    };
    let headers = {
      User: userId,
    };
    // debugger;
    await transferCartItem(payload, {
      headers: headers,
      onSuccess: (res) => {
        if (res && res.data && res.data.error == true) {
          toast.error("cart items not transfered!");
          return;
        }
        // debugger;
      },
      onFailed: (err) => {
        toast.error("cart items not transfered!");
      },
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const location = getSessionStorageItem("location");
    const isValid = validateLoginForm();
    if (isValid) {
      const payload = {
        ...userState,
        shopID: settings?.deliveryInfo?.shopId ?? shopId,
      };

      const havAdvance =
        settings?.tableReservationSettings.haveAdvance === "Yes" ? true : false;

      let reserAdvAmt = 0;

      if (havAdvance) {
        reserAdvAmt = settings?.tableReservationSettings.advanceAmount;
      }

      await userLogin(payload, {
        onSuccess: async (res) => {
          if (res?.data?.error == true) {
            let errMsg =
              res?.data?.errorMessage?.message ?? "Authentication failed!";
            toast.error(errMsg);
            return;
          } else {
            const userId = res?.data?.data?.user?.userID;
            const token = res?.data?.data?.token;
            const guestId = getLocalStorageItem("UserPersistent");

            setLocalStorageItem("UserPersistent", userId);
            setLocalStorageItem("userToken", token);
            setLocalStorageItem("guest", false);

            if (havAdvance) {
              router.push(`/reservation-checkout?advance=${reserAdvAmt}`);
              return;
            }
            completeNewReservation();
            if (guestId) {
              await transferCartItems(guestId, userId);
            } else {
              console.log("GUEST ID IS NOT AVAILABLE");
            }
          }
        },
        onFailed: (err) => {},
      });
    }
  };
  const handleGuestLogin = () => {
    router.push("/reservation-guest");
  };
 
  const completeNewReservation = async () => {
    const mergedBooking = Utils.mergeBookingDateTime(
      initialValues?.bookingDate,
      initialValues?.bookingTime
    );
    const token = getLocalStorageItem("userToken");
    let userId;
    const decodeBase64 = (str) => {
      try {
        return JSON.parse(atob(str));
      } catch (e) {
        console.error("Invalid Base64 string", e);
        return null;
      }
    };

    const parts = token.split(".");
    if (parts.length >= 2) {
      const header = decodeBase64(parts[0]); // Decode Header
      const payload = decodeBase64(parts[1]); // Decode Payload
      userId = payload.data;
    } else {
      console.error("Invalid token format");
    }
  
    const payload = {
      shopID: shopId,
      userID: userId?.userID,
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
        setSecretKey("");
        removeSessionStorageItem("reserv_details");
        toast.success("Reservation completed successfully");
        router.push("/");
      },
      onFailed: (err) => {
        console.log(err);
      },
      headers,
    });
  };
  return (
    <Fragment>
      <div className="container">
        <div className="login_wrapper ">
          <div className="card login_comp col-md-6 col-lg-4 col-sm-12 mx-auto">
            <h2>Please login and continue</h2>
            <p className="sub_title_login">
              Welcome to our platform! To access your account and continue
              exploring all the features we offer, please log in with your
              credentials. If you don’t have an account yet, you can sign up to
              get started. If you encounter any issues, feel free to reach out
              to our support team for assistance.
            </p>

            <div className="">
              <form action="" onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <div className="form-label orderOnline_label">Username</div>
                  <input
                    type="email"
                    name="user"
                    id="userName"
                    className="form-control"
                    value={userState.userName}
                    onChange={handleInputChange}
                  />
                  {errors.userName && (
                    <p className="error">{errors.userName}</p>
                  )}
                </div>
                <div className="form-group my-4">
                  <div className="form-label orderOnline_label">Password</div>
                  <div className="pass_wrapper">
                    <input
                      type={!showpass ? "password" : "text"}
                      name="password"
                      id="pass_inp"
                      className="form-control"
                      value={userState.password}
                      onChange={handleInputChange}
                      autocomplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showpass)}
                    >
                      {!showpass ? <Fa6.FaRegEyeSlash /> : <Fa6.FaRegEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="error">{errors.password}</p>
                  )}
                </div>
                <p
                  className="forgot_pass"
                  onClick={() => router.push("/forgotPasswordStep")}
                >
                  Forgot Password?
                </p>
                <button
                  type="submit"
                  className="login_btn"
                  disabled={authLoading}
                >
                  {!authLoading ? (
                    "Login"
                  ) : (
                    <Fragment>
                      <div
                        className="spinner-border spinner-border-sm text-light"
                        role="status"
                      ></div>
                      <span className="sr-only ps-2">Please wait...</span>
                    </Fragment>
                  )}
                </button>
              </form>
            </div>
            {/* <p className="or_">or</p>
            <button
              type="button"
              className="guest_btn"
              onClick={handleGuestLogin}
            >
              Login as Guest
            </button> */}
            <p className="sign_up_">
              Didn't have an account? <a href="/register">Signup here.</a>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ReservationLogin;
