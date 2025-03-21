"use client";
import React, { Fragment, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import Logo from "../../../../../public/Assets/logo.png";
import { setSessionStorageItem } from "../../_utils/ClientUtils";
import { AppContext } from "../../order-online-page/context";

function Step() {
  const { authLoading, settings, passwordResetMail, sentOTPtoUser } =
    useContext(AppContext);
  const router = useRouter();
  const [email, setEmail] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email == null || email.length == 0 || email == "") {
      toast.error("Please Provide Registered Email to continue this process!");
      return;
    }

    const payload = {
      shopID: process.env.SHOP_ID,
      useremailid: email,
      FPsecretkey: process.env.FOODPAGE_SECRET_KEY,
    };

    await passwordResetMail(payload, {
      onSuccess: async (res) => {
        setSessionStorageItem("passwordresetemail", email);
        toast.success(
          "An OTP has been sent to your registered email address. Please proceed to the next step."
        );
        router.push("/forgotpassword");
      },
      onFailed: (err) => {
        toast.error("Something Went Wrong!");
      },
    });
  };
  return (
    <section className="table_reserv__">
      <div className="container">
        <div className="col-md-6 col-sm-12 mx-auto mb-3 pb-150">
          <div className="text-center pb-30 mx-auto">
            <Image src={Logo} alt="Logo" layout="contain" />
          </div>
          <p className="text-center">
            To reset your password, please submit your registered email.
          </p>
          <div className="card p-3">
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="ltn__form-box contact-form-box"
            >
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <label>Email</label>
                  <span className="red">*</span>
                  <input
                    type="email"
                    className="reset-input"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="btn-wrapper sub_btn_pass mt-3 text-center">
                <button className="btn-pas" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Step;
