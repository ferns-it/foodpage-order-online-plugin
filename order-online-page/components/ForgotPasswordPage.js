"use client";
import { useRouter } from "next/navigation";
import React, { Fragment, useContext, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AppContext } from "../context";
import CryptoJS from "crypto-js";
import { toast } from "react-hot-toast";
import { setSessionStorageItem } from "../../_utils/ClientUtils";

function ForgotPasswordPage() {
  const router = useRouter();
  const { sentOTPtoUser, authLoading, settings, passwordResetMail, shopId } =
    useContext(AppContext);
  const encryptToMD5 = (number) => {
    return CryptoJS.MD5(number).toString();
  };
  const [user, setUser] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleValidationPassword = () => {
    let valid = true;
    let errors = {};

    if (!user.email) {
      valid = false;
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      valid = false;
      errors.email = "Email address is invalid.";
    }
    setErrors(errors);
    return valid;
  };
  const handleForgotPassword = async () => {
    if (handleValidationPassword()) {
      const payload = {
        shopID: JSON.stringify(shopId),
        useremailid: user.email,
        FPsecretkey: process.env.FOODPAGE_SECRET_KEY,
      };
      // return
      await passwordResetMail(payload, {
        onSuccess: async (res) => {
          setSessionStorageItem("loginMail",user.email)
          toast.success("OTP Sended Successfully!");
          router.push("/resetpassword");
        },
        onFailed: (err) => {
       
          const errMsg = err?.errorMessage?.message ?? "FAILED TO SEND OTP!";
          toast.error(errMsg);
        },
      });
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div style={{height:"80px"}}></div>
        <div className="password_wrapper">
          <div className="card password_comp">
            <h2>Forgot password?</h2>
            <p>No worries,we'll send you reset instructions.</p>

            <div className="container">
              <form action="" onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label email_in">
                    Enter your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={user.email}
                    onChange={handleInputChange}
                  />
                  {errors?.email && <p className="error">{errors?.email}</p>}
                </div>

                <button
                  className="continue_btn mt-4"
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={authLoading}
                >
                  Continue
                </button>
              </form>
              <span
                className="back_btn mt-2"
                onClick={() => router.push("/login")}
              >
                <i>
                  <IoIosArrowRoundBack />
                </i>
                Back to Login
              </span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ForgotPasswordPage;
