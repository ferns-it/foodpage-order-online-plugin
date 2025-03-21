"use client";
import React, { useContext, useState } from "react";

// import Logo from "../../../public/img/logo.png";
import OTPInput from "react-otp-input";
import * as Fi from "react-icons/fi";
import Image from "next/image";
import { toast } from "react-toastify";
import { AppContext } from "../../order-online-page/context";
import { useRouter } from "next/navigation";
import { getSessionStorageItem } from "../../_utils/ClientUtils";
import "../style/Style.css";
function ForgotPass() {
  const { authLoading, resetPassword,otpLoading, passwordResetMail } =
    useContext(AppContext);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [reservOTP, setReservOTP] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const emailaddress = getSessionStorageItem("passwordresetemail");

  const resendOTP = async () => {
    if (!emailaddress) {
      toast.error("Please update your email address!");
      router.push("/forgotPasswordStep");
      return;
    }

    const payload = {
      shopID: process.env.SHOP_ID,
      useremailid: emailaddress,
      FPsecretkey: process.env.FOODPAGE_SECRET_KEY,
    };

    await passwordResetMail(payload, {
      onSuccess: () => {
        toast.success("OTP sent successfully!");
      },
      onFailed: () => {
        toast.error("Something went wrong!");
      },
    });
  };

  const handleResetPassword = async () => {
    if (!reservOTP || !userPassword) {
      toast.error("Please enter OTP and a new password.");
      return;
    }
    if (userPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (/\s/.test(userPassword)) {
      toast.error("Password must not contain white spaces.");
      return;
    }

    const payload = {
      shopID: process.env.SHOP_ID,
      useremailid: emailaddress,
      otp: reservOTP,
      password: userPassword,
      FPsecretkey: process.env.FOODPAGE_SECRET_KEY,
    };
    await resetPassword(payload, {
      onSuccess: (res) => {
        if (res.data.error == false) {
          toast.success("Password reset successfully!");
          sessionStorage.removeItem("passwordresetemail");
          router.push("/reservation-login");
        } else {
          toast.error(res.data.errorMessage.message || "Something went wrong!");
        }
      },
      onFailed: () => {
        toast.error("Something went wrong!");
      },
    });
  };
  return (
    <div>
      <section>
        <div className="container pt-100">
          <div className="col-md-8 mx-auto text-center mb-3">
            {/* <Image src={Logo} alt="Logo" width={300} height={100} /> */}
          </div>

          <div className="card table_reservation_card mx-auto text-center col-md-8 mx-auto mb-3">
            <h3 className="pt-50 text-center">OTP Verification</h3>
            <p className="table_reserv_info_sub_head text-center">
              Your OTP has been sent to <strong>{emailaddress}</strong>
            </p>
            <div className="otp_validation_reserv mx-auto reset-otp-style">
              <label>
                OTP <span className="red">*</span>
              </label>
              {/* <OTPInput
                value={reservOTP}
                onChange={(otp) => setReservOTP(otp)}
                numInputs={5}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              /> */}
              <input
                type="text"
                name=""
                id=""
                value={reservOTP}
                onChange={(e) => setReservOTP(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="mx-auto col-md-7 col-sm-12 p-2">
              <label>
                New Password <span className="red">*</span>
              </label>
              <div className="mt-3 mx-auto">
                <div className="otp-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="userPassword"
                    className="passwordin form-control border-warning"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="eye_btn_fgt"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Fi.FiEye /> : <Fi.FiEyeOff />}
                  </button>
                </div>
              </div>
            </div>

            <p className="resend_otp_reservv red cursor-pointer">
              {!otpLoading ? (
                <span onClick={resendOTP}>Resend OTP?</span>
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
            <div className="btn-wrapper mt-3 mx-auto pb-50">
              {authLoading ? (
                <button className="btn btn- btn-block w-30" disabled>
                  ...
                </button>
              ) : (
                <button
                  className="btn btn-danger btn-block w-30"
                  type="button"
                  onClick={handleResetPassword}
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPass;
