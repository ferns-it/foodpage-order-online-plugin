"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Go from "react-icons/go";
import * as Io from "react-icons/io5";
import { GrLocation } from "react-icons/gr";
import { TableReservationContext } from "../context/TableReservationContext";
import Utils from "../utils/Utils";
import { toast } from "react-hot-toast";
import "../style/Style.css";

const RECAPTCHA_SITE_KEY = "6LeXD-8pAAAAAOpi7gUuH5-DO0iMu7J6C-CBA2fo"; //! add new captcha

function TableReservationForm({ setIsActiveTablePage, encryptToMD5, shopId }) {
  // const {
  //   getShopTiming,
  //   shopTiming,
  //   isTimingLoading,
  //   reservationLoading,
  //   sendReservationOTP,
  //   setInitialValues,
  //   initialValues,
  //   secretKey,
  //   setSecretKey,
  // } = useContext(TableReservationContext);
  const [count, setCount] = useState(0);
  const [hashcode, setHashcode] = useState("");
  const [isReservErr, setIsReservErr] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [dayValue, setDayValue] = useState("");

  // useEffect(() => {
  //   if (!shopId) return;
  //   getShopTiming(shopId);
  // }, [shopId]);
  // useEffect(() => {
  //   setInitialValues((prev) => ({ ...prev, noOfChairs: count }));
  // }, [count]);
  // useEffect(() => {
  //   const today = new Date();
  //   const yyyy = today.getFullYear();
  //   const mm = String(today.getMonth() + 1).padStart(2, "0");
  //   const dd = String(today.getDate()).padStart(2, "0");
  //   const formattedToday = `${yyyy}-${mm}-${dd}`;

  //   setMinDate(formattedToday);
  // }, []);

  // console.log(shopTiming, "shopTiming");
  

  let oneTimePass;
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInitialValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const validatePhoneNumber = (e) => {
    const regex = /[^\d()-]/g;
    const value = e.target.value;

    const cleanedValue = value.replace(regex, "");

    setInitialValues((prevValues) => ({
      ...prevValues,
      phone: cleanedValue,
    }));

    if (value !== cleanedValue) {
      e.target.value = cleanedValue;
    }
    };
    
  function removeSpecialChars(e) {
    const regex = /[^a-zA-Z0-9 ]/g;
    const value = e.target.value;
    const cleanedValue = value.replace(regex, "");

    setInitialValues((prevValues) => ({
      ...prevValues,
      name: cleanedValue,
    }));

    if (value !== cleanedValue) {
      e.target.value = cleanedValue;
    }
  }
  const validateReservForm = () => {
    for (const key in initialValues) {
      if (
        initialValues.hasOwnProperty(key) &&
        key !== "message" &&
        !initialValues[key]
      ) {
        setIsReservErr(true);
        return true;
      }
    }
    setIsReservErr(false);
    return false;
  };

  const handleIncrement = () => {
    if (count === 25) return;
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count === 1) return;
    setCount(count - 1);
  };

  const handleCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCount(value);
    } else {
      setCount(0); // Default to 0 if the input is invalid
    }
  };
  const handleCaptchaLoaded = (_) => {
    window.grecaptcha.ready((_) => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action: "formpage" })
        .then((token) => {
          // console.log("Captcha Token", token);
        })
        .catch((err) => console.log("CAPTCHA ERROR", err));
    });
  };
  useEffect(() => {
    // Add reCaptcha
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.addEventListener("load", handleCaptchaLoaded);
    document.body.appendChild(script);
  }, []);
  const handleTableReservation = async (e) => {
    e.preventDefault();

    const isValid = validateReservForm();

    if (isValid) return;

    if (!shopId) {
      toast.error("Shop Id is required");
      return;
    }
    if (
      !oneTimePass ||
      oneTimePass.length != 0 ||
      (secretKey && secretKey.length == 0)
    ) {
      oneTimePass = Utils.generateOTP();
    }

    const md5Num = encryptToMD5(oneTimePass);

    // const url =
    //   "https://foodpage.co.uk/development/v2/shop/user/diningtable/reservation/sendotp";
    const headers = {
      "x-secretkey": "ec34da9797361750e401e435c4860720",
    };

    const payload = {
      shopID: shopId,
      name: initialValues.name,
      email: initialValues.email,
      otp: oneTimePass,
      phone: initialValues.phone,
    };

    await sendReservationOTP(payload, {
      onSuccess: (res) => {
        sessionStorage.setItem("hashcode", md5Num);
        // localStorage.setItem("pageState");
        setSecretKey(md5Num);
        const errStatus = res.data.error;
        if (errStatus == false) {
          toast.success("OTP send successfully!");
          setTimeout(() => {
            setIsActiveTablePage("otp-page");
          }, 1000);
        } else {
          toast.error("OTP not send!");
        }
      },
      onFailed: (err) => {
        toast.error("Error on sending OTP");
        console.log("OTP ERROR", err);
      },
      headers: headers,
    });

    // try {
    //   setResponseLoading(true);
    //   const response = await axios.post(url, payload, { headers });
    //   if (response) {
    //     sessionStorage.setItem("hashcode", md5Num);
    //     setSecretKey(md5Num);

    //     console.log(response);
    //     if (response && response.data.error === false) {
    //       toast.success("OTP sent successfully");
    //       setTimeout(() => {
    //         setIsActiveTablePage("otp-page");
    //       }, 1000);
    //     } else {
    //       toast.error("OTP not send!");
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error posting data:", error);
    // } finally {
    //   setResponseLoading(false);
    // }
  };
  // useEffect(() => {
  //   function getDayOfWeek(dateString) {
  //     const date = new Date(dateString);
  //     const dayOfWeek = date.getDay();
  //     const dayNames = [
  //       "sunday",
  //       "monday",
  //       "tuesday",
  //       "wednesday",
  //       "thursday",
  //       "friday",
  //       "saturday",
  //     ];
  //     const dayName = dayNames[dayOfWeek];
  //     return dayName;
  //   }
  //   const day = getDayOfWeek(initialValues.bookingDate);
  //   setDayValue(day);
  // }, []);

  return (
    <div className="table_reserv__">
      <Fragment>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12 order-lg-1 order-md-1 order-sm-2">
              <div className="card table_reservation_card">
                <h3 className="table-reservation-form-head">
                  Table Reservation Form
                </h3>
                <form
                  action=""
                  className="p-3"
                  onSubmit={(e) => handleTableReservation(e)}
                >
                  <div className="row">
                    <div className="col-lg-4 col-md-4 ol-sm-4">
                      <div className="form-group">
                        <label
                          htmlFor="name"
                          className="form-label table_reserv_form_label"
                        >
                          Booking Person Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id=""
                          className={
                            "form-control table_reserv_form_input " +
                            (isReservErr && initialValues.name.length === 0
                              ? "err__"
                              : "")
                          }
                          onChange={removeSpecialChars}
                        ></input>
                      </div>
                      {isReservErr && initialValues.name.length === 0 && (
                        <span className="reserv_from_err">
                          Name is Required!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-4 col-md-4 ol-sm-4">
                      <div className="form-group">
                        <label
                          htmlFor="email"
                          className="form-label table_reserv_form_label"
                        >
                          Booking Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id=""
                          className={
                            "form-control table_reserv_form_input " +
                            (isReservErr && initialValues.email.length === 0
                              ? "err__"
                              : "")
                          }
                          onChange={handleChange}
                        ></input>
                      </div>
                      {isReservErr && initialValues.email.length === 0 && (
                        <span className="reserv_from_err">
                          Email Address is Required!
                        </span>
                      )}
                    </div>

                    <div className="col-lg-4 col-md-4 ol-sm-4">
                      <div className="form-group">
                        <label
                          htmlFor="phone"
                          className="form-label table_reserv_form_label"
                        >
                          Phone number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id=""
                          className={
                            "form-control table_reserv_form_input " +
                            (isReservErr && initialValues.phone.length === 0
                              ? "err__"
                              : "")
                          }
                          onChange={validatePhoneNumber}
                          maxLength={15}
                        ></input>
                      </div>
                      {isReservErr && initialValues.phone.length === 0 && (
                        <span className="reserv_from_err">
                          Phone Number is Required!
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-lg-4 col-md-4 ol-sm-4">
                      <div className="form-group">
                        <label
                          htmlFor="bookingDate"
                          className="form-label table_reserv_form_label"
                        >
                          Booking Date
                        </label>
                        <input
                          type="date"
                          name="bookingDate"
                          id=""
                          className={
                            "form-control table_reserv_form_input " +
                            (isReservErr &&
                            initialValues.bookingDate.length === 0
                              ? "err__"
                              : "")
                          }
                          onChange={handleChange}
                          min={minDate}
                        ></input>
                      </div>
                      {isReservErr &&
                        initialValues.bookingDate.length === 0 && (
                          <span className="reserv_from_err">
                            Booking Date is Required!
                          </span>
                        )}
                    </div>
                    <div className="col-lg-4 col-md-4 ol-sm-4">
                      <div className="form-group">
                        <label
                          htmlFor="bookingTime"
                          className="form-label table_reserv_form_label"
                        >
                          Booking Time
                        </label>
                        <input
                          type="time"
                          name="bookingTime"
                          id=""
                          className={
                            "form-control table_reserv_form_input " +
                            (isReservErr &&
                            initialValues.bookingTime.length === 0
                              ? "err__"
                              : "")
                          }
                          onChange={handleChange}
                        ></input>
                      </div>
                      {isReservErr &&
                        initialValues.bookingTime.length === 0 && (
                          <span className="reserv_from_err">
                            Booking Time is Required!
                          </span>
                        )}
                    </div>

                    <div className="col-lg-4 col-md-4 ol-sm-4">
                      <label
                        htmlFor="phone"
                        className="form-label table_reserv_form_label"
                      >
                        No of Chairs
                      </label>
                      <div className="inc_dec_wrapper_0291">
                        <div className="incDec_wrapper_0291">
                          <input
                            type="checkbox"
                            id="toggle"
                            min={1}
                            className="toggle-checkbox"
                          />
                          <div className="counter-container">
                            <label
                              for="toggle"
                              className="decrement-button"
                              onClick={handleDecrement}
                            >
                              -
                            </label>
                            <input
                              className="counter-text"
                              value={count}
                              onChange={(e) => handleCountChange(e)}
                            />
                            <label
                              for="toggle"
                              className="increment-button red"
                              onClick={handleIncrement}
                            >
                              +
                            </label>
                          </div>
                        </div>
                      </div>
                      {isReservErr && initialValues.noOfChairs == 0 && (
                        <span className="reserv_from_err">
                          Select a valid number of chairs!
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="row my-4">
                    <div className="col-12">
                      <label
                        htmlFor="message"
                        className="form-label table_reserv_form_label"
                      >
                        Message to Restaurent
                      </label>
                      <textarea
                        name="message"
                        id=""
                        className="form-control"
                        rows={5}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="submit_reserv_btn"
                    // disabled={reservationLoading}
                  >
                    {/* {reservationLoading === false ? (
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
                    )} */}
                  </button>
                </form>
                {/* <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_CAPTCHA_SITE_KEY}/> */}
                <div
                  className="g-recaptcha"
                  data-sitekey={RECAPTCHA_SITE_KEY}
                  data-size="invisible"
                ></div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 order-lg-2 order-md-2 order-sm-1">
              <div className="card timing_card_table_reserv ">
                <p className="open_">
                  <i className="pe-1">
                    <GrLocation />
                  </i>
                  <span>Location</span>
                </p>
                <p className="location___">
                  Guruviharrr, Kadakkavoor, Thiruvananthapuram
                </p>
                <p className="open_">
                  <i className="pe-1">
                    <Io.IoTimeOutline />
                  </i>
                  <span>Open Hours</span>
                </p>
                {/* {isTimingLoading ? (
                  <span className="sr-only ps-2">Loading...</span>
                ) : (
                  <div className="timing_cart_reserv">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="day_wrapper_reserv_table">
                          <p className="day__">Sunday</p>
                          <ul className="reserv_timing__">
                            {shopTiming &&
                              shopTiming.shopTiming &&
                              shopTiming.shopTiming.sunday &&
                              shopTiming.shopTiming.sunday.map(
                                (sunday, daykey) => {
                                  if (sunday.status == "active") {
                                    return (
                                      <>
                                        <li key={daykey}>
                                          {sunday?.openingTime
                                            ? Utils.convertTiming(
                                                sunday?.openingTime
                                              )
                                            : "N/A"}{" "}
                                          -{" "}
                                          {sunday?.closingTime
                                            ? Utils.convertTiming(
                                                sunday?.closingTime
                                              )
                                            : "N/A"}
                                        </li>
                                      </>
                                    );
                                  }
                                }
                              )}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="day_wrapper_reserv_table">
                          <p className="day__">Monday</p>
                          <ul className="reserv_timing__">
                            {shopTiming &&
                              shopTiming.shopTiming &&
                              shopTiming.shopTiming.monday &&
                              shopTiming.shopTiming.monday.map((monday) => {
                                if (monday.status == "active") {
                                  return (
                                    <>
                                      <li>
                                        {monday?.openingTime
                                          ? Utils.convertTiming(
                                              monday?.openingTime
                                            )
                                          : "N/A"}{" "}
                                        -{" "}
                                        {monday?.closingTime
                                          ? Utils.convertTiming(
                                              monday?.closingTime
                                            )
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="day_wrapper_reserv_table">
                          <p className="day__">Tuesday</p>
                          <ul className="reserv_timing__">
                            {shopTiming &&
                              shopTiming.shopTiming &&
                              shopTiming.shopTiming.tuesday &&
                              shopTiming.shopTiming.tuesday.map((tuesday) => {
                                if (tuesday.status == "active") {
                                  return (
                                    <>
                                      <li>
                                        {tuesday?.openingTime
                                          ? Utils.convertTiming(
                                              tuesday?.openingTime
                                            )
                                          : "N/A"}{" "}
                                        -{" "}
                                        {tuesday?.closingTime
                                          ? Utils.convertTiming(
                                              tuesday?.closingTime
                                            )
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              })}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="day_wrapper_reserv_table">
                          <p className="day__">Wednesday</p>
                          <ul className="reserv_timing__">
                            {shopTiming &&
                              shopTiming.shopTiming &&
                              shopTiming.shopTiming.wednesday &&
                              shopTiming.shopTiming.wednesday.map(
                                (wednesday) => {
                                  if (wednesday.status == "active") {
                                    return (
                                      <>
                                        <li>
                                          {wednesday?.openingTime
                                            ? Utils.convertTiming(
                                                wednesday?.openingTime
                                              )
                                            : "N/A"}{" "}
                                          -{" "}
                                          {wednesday?.closingTime
                                            ? Utils.convertTiming(
                                                wednesday?.closingTime
                                              )
                                            : "N/A"}
                                        </li>
                                      </>
                                    );
                                  }
                                }
                              )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="day_wrapper_reserv_table">
                          <p className="day__">Thursay</p>
                          <ul className="reserv_timing__">
                            {shopTiming &&
                              shopTiming.shopTiming &&
                              shopTiming.shopTiming.thursday &&
                              shopTiming.shopTiming.thursday.map((thursday) => {
                                if (thursday.status == "active") {
                                  return (
                                    <>
                                      <li>
                                        {thursday?.openingTime
                                          ? Utils.convertTiming(
                                              thursday?.openingTime
                                            )
                                          : "N/A"}{" "}
                                        -{" "}
                                        {thursday?.closingTime
                                          ? Utils.convertTiming(
                                              thursday?.closingTime
                                            )
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              })}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="day_wrapper_reserv_table">
                          <p className="day__">Friday</p>
                          <ul className="reserv_timing__">
                            {shopTiming &&
                              shopTiming.shopTiming &&
                              shopTiming.shopTiming.friday &&
                              shopTiming.shopTiming.friday.map((friday) => {
                                if (friday.status == "active") {
                                  return (
                                    <>
                                      <li>
                                        {friday?.openingTime
                                          ? Utils.convertTiming(
                                              friday?.openingTime
                                            )
                                          : "N/A"}{" "}
                                        -{" "}
                                        {friday?.closingTime
                                          ? Utils.convertTiming(
                                              friday?.closingTime
                                            )
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="day_wrapper_reserv_table">
                          <p className="day__">Saturday</p>
                          <ul className="reserv_timing__">
                            {shopTiming &&
                              shopTiming.shopTiming &&
                              shopTiming.shopTiming.saturday &&
                              shopTiming.shopTiming.saturday.map((saturday) => {
                                if (saturday.status == "active") {
                                  return (
                                    <>
                                      <li>
                                        {saturday?.openingTime
                                          ? Utils.convertTiming(
                                              saturday?.openingTime
                                            )
                                          : "N/A"}{" "}
                                        -{" "}
                                        {saturday?.closingTime
                                          ? Utils.convertTiming(
                                              saturday?.closingTime
                                            )
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              })}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6"></div>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
}

export default TableReservationForm;
