import React, { Fragment, useContext, useState } from "react";
import * as Fa6 from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { AppContext } from "../context";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  redirectToLocation,
  setLocalStorageItem,
} from "@/src/app/_utils/ClientUtils";

function LoginPage({ handleGuestLogin, errors, setErrors }) {
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
  const [showpass, setShowPass] = useState(false);
  const [userState, setUserState] = useState({
    user: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  console.log(settings, "settings");
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
    console.log(guestId, userId);
    // debugger;
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
        console.log("CART ITEMS TRANSFERED");
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

      await userLogin(payload, {
        onSuccess: async (res) => {
          console.log("login response", res.data);

          if (res && res.data && res.data.error == true) {
            let errMsg =
              res?.data?.errorMessage?.message ?? "Authentication failed!";
            toast.error(errMsg);
            return;
          }

          const userId = res?.data?.data?.user?.userID;
          const token = res?.data?.data?.token;
          const guestId = getLocalStorageItem("UserPersistent");
          
          setLocalStorageItem("UserPersistent", userId);
          setLocalStorageItem("userToken", token);
          setLocalStorageItem("guest", false);
          console.log("userId", userId);
          console.log("guestId", guestId);

          if (guestId) {
            await transferCartItems(guestId, userId);
          } else {
            console.log("GUEST ID IS NOT AVAILABLE");
          }

          toast.success("User Logged in successfully!");

          setTimeout(() => {
            if (location == "login") {
              redirectToLocation("/");
            } else {
              redirectToLocation("/checkout");
            }
          }, 800);
        },
        onFailed: (err) => {
          console.log("error=>", err);
          toast.error(err?.response?.data?.errorMessage?.message ||"Authentication Failed");
        },
      });
    }
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
                  onClick={() => router.push("/forgot-password")}
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
            <p className="or_">or</p>
            <button
              type="button"
              className="guest_btn"
              onClick={handleGuestLogin}
            >
              Login as Guest
            </button>
            <p className="sign_up_">
              Didn't have an account? <a href="/register">Signup here.</a>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default LoginPage;
