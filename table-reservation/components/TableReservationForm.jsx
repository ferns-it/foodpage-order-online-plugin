"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Go from "react-icons/go";
import * as Io from "react-icons/io5";
import * as Md from "react-icons/md";
import * as Im from "react-icons/im";
import { GrLocation } from "react-icons/gr";
import { TableReservationContext } from "../context/TableReservationContext";
import Utils from "../utils/Utils";
import { toast } from "react-hot-toast";
import "../style/Style.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getLocalStorageItem,
  setSessionStorageItem,
} from "../../_utils/ClientUtils";
import axios from "axios";
import Lottie from "react-lottie";
import lottieFile from "../assets/lottie/Animation - 1734505645259.json";
import Image from "next/image";
import TableReservDisabled from "../assets/table-reservation-disabled.png";

const RECAPTCHA_SITE_KEY = "6LeXD-8pAAAAAOpi7gUuH5-DO0iMu7J6C-CBA2fo";

const findToday = () => {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const today = new Date();
  const dayName = daysOfWeek[today.getDay()];

  return dayName;
};

function TableReservationForm({ setIsActiveTablePage, encryptToMD5, shopId }) {
  const router = useRouter();
  const searchparams = useSearchParams();
  const {
    getShopTiming,
    shopTiming,
    isTimingLoading,
    reservationLoading,
    sendReservationOTP,
    setInitialValues,
    initialValues,
    secretKey,
    setSecretKey,
    tableReservationSettings,
    loading,
    upcomingHolidays,
  } = useContext(TableReservationContext);
  const [count, setCount] = useState(1);
  const [hashcode, setHashcode] = useState("");
  const [isReservErr, setIsReservErr] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [dayValue, setDayValue] = useState(null);
  const [timeIntervals, setTimeIntervals] = useState(null);
  const [formValidationLoading, setFormValidationLoading] = useState(false);
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [isTodayHoliday, setIsTodayHoliday] = useState(false);

  useEffect(() => {
    setInitialValues((prev) => ({ ...prev, bookingDate: defaultDate }));
  }, [upcomingHolidays]);

  useEffect(() => {
    const hasOtp = searchparams.has("otp");

    if (hasOtp) {
      setIsActiveTablePage("otp-page");
      return;
    }
  }, [searchparams]);

  useEffect(() => {
    if (!shopId) return;
    getShopTiming(shopId);
  }, [shopId]);

  useEffect(() => {
    setInitialValues((prev) => ({ ...prev, noOfChairs: count }));
  }, [count]);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    setMinDate(formattedToday);
  }, []);

  useEffect(() => {
    const today = new Date();
    const holidayToday = isHoliday(today);
    setIsTodayHoliday(holidayToday);

    const nextAvailableDate =
      holidayToday === true ? findNextAvailableDay(today) : today;

    setDefaultDate(nextAvailableDate);
  }, [upcomingHolidays]);

  useEffect(() => {
    if (!tableReservationSettings || !dayValue) return;

    const todaysTiming = tableReservationSettings[dayValue];

    if (!todaysTiming || todaysTiming.length === 0) {
      setTimeIntervals([]);
      return;
    }

    const timeInterval =
      typeof tableReservationSettings?.time_interval == "string"
        ? parseInt(tableReservationSettings?.time_interval)
        : tableReservationSettings?.time_interval;

    const findIntervals = todaysTiming.flatMap((time) =>
      Utils.getTimeIntervals(time.start, time.end, timeInterval)
    );

    setTimeIntervals(findIntervals);
  }, [tableReservationSettings, dayValue]);

  useEffect(() => {
    if (initialValues && !initialValues.bookingDate) return;
    getSelectedDay(initialValues.bookingDate);
  }, [initialValues]);

  const getSelectedDay = (bookingDate) => {
    const day = Utils.getDayOfWeek(bookingDate);
    setDayValue(day);
  };

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

  const reservationValidation = async (bookingTime, chairs) => {
    const requestBody = {
      bookingTime,
      chairs,
      shopId: process.env.SHOP_ID,
      shopUrl: process.env.SHOP_URL,
    };

    console.log(requestBody);

    const url = "https://shopadmin.vgrex.com/settings/validate-enquiry";

    try {
      const response = await axios.post(url, requestBody);
      return true; // Validation success
    } catch (error) {
      const errMsg =
        error.response?.data?.errormessage || "Something went wrong";
      toast.error(errMsg);
      console.error("Error:", errMsg);
      return false;
    }
  };

  const lateBookingValidation = () => {
    const today = new Date();
    const bookingDate = initialValues?.bookingDate;
    const bookingTime = initialValues?.bookingTime;

    const lateBooking =
      typeof tableReservationSettings?.late_booking === "string"
        ? parseInt(tableReservationSettings?.late_booking)
        : tableReservationSettings?.late_booking;

    if (bookingDate == null || lateBooking == null) {
      toast.error("Invalid requirements!");
      return;
    }

    const diffInTime = today.getTime() - bookingDate.getTime();

    const diffInMinutes = Math.ceil(diffInTime / (1000 * 60));

    return diffInMinutes >= lateBooking;
  };

  const disabledDates =
    upcomingHolidays != null &&
    upcomingHolidays.length != 0 &&
    upcomingHolidays.reduce((dates, holiday) => {
      const startDate = new Date(holiday.startTime);
      const endDate = new Date(holiday.endTime);

      while (startDate <= endDate) {
        dates.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
      }
      return dates;
    }, []);

  const isHoliday = (date) => {
    return (
      disabledDates &&
      disabledDates.length != 0 &&
      disabledDates.some(
        (disabledDate) =>
          disabledDate.toISOString().split("T")[0] ===
          date.toISOString().split("T")[0]
      )
    );
  };

  const findNextAvailableDay = (date) => {
    while (isHoliday(date)) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  };

  const earlyBookingValidation = () => {
    const today = new Date();
    const bookingDate = initialValues?.bookingDate;
    const earlyBooking =
      typeof tableReservationSettings?.early_booking == "string"
        ? parseInt(tableReservationSettings?.early_booking)
        : tableReservationSettings?.early_booking;

    if (bookingDate == null || earlyBooking == null) {
      toast.error("invalid requirements!");
      return;
    }

    const maxBookingDate = new Date(today);
    maxBookingDate.setDate(today.getDate() + earlyBooking);

    return bookingDate <= maxBookingDate;
  };

  const isBookingValid = () => {
    const bookingDate = initialValues?.bookingDate;
    const bookingTime = initialValues?.bookingTime;
    const now = new Date();

    const bookingDateNew = new Date(bookingDate);

    const isSameDay =
      now.getDate() === bookingDateNew.getDate() &&
      now.getMonth() === bookingDateNew.getMonth() &&
      now.getFullYear() === bookingDateNew.getFullYear();

    if (isSameDay) {
      const [hours, minutes] = bookingTime.split(":").map(Number);

      const bookingDateTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );

      // Check if booking is within the valid time range (4 hours before)
      const timeDifference = bookingDateTime - now;
      const fourHoursInMilliseconds = 4 * 60 * 60 * 1000;

      if (timeDifference > fourHoursInMilliseconds) {
        return false;
      } else {
        return true;
      }
    }

    return false;
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
    const size = tableReservationSettings?.max_party_size;
    if (count === size) return;
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count === 1) return;
    setCount(count - 1);
  };

  const handleCountChange = (e) => {
    const limit = tableReservationSettings.max_party_size;

    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCount(value);
    } else {
      setCount(0);
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

    try {
      setFormValidationLoading(true);
      const isValid = validateReservForm();

      if (isValid) return;

      //! condition for current UK time
      // const isValidBookingTIme = isBookingValid();
      // if (isValidBookingTIme === true) {
      //   toast.error(`Please select a time at least 4 hours from now!`);
      //   return;
      // }

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

      const headers = {
        "x-secretkey": process.env.FOODPAGE_RESERVATION_SECRET_KEY,
      };

      const payload = {
        shopID: shopId,
        name: initialValues.name,
        email: initialValues.email,
        otp: oneTimePass,
        phone: initialValues.phone,
      };

      const mergedBooking = Utils.mergeBookingDateTime(
        initialValues?.bookingDate,
        initialValues?.bookingTime
      );

      const isReservationValid = await reservationValidation(
        mergedBooking,
        initialValues?.noOfChairs
      );

      if (isReservationValid === false) return;

      await sendReservationOTP(payload, {
        onSuccess: (res) => {
          sessionStorage.setItem("hashcode", md5Num);
          // localStorage.setItem("pageState");
          setSecretKey(md5Num);
          const errStatus = res.data.error;
          if (errStatus == false) {
            toast.success("OTP send successfully!");
            setTimeout(() => {
              const saveObj =
                initialValues && typeof initialValues == "object"
                  ? JSON.stringify(initialValues)
                  : initialValues;

              setSessionStorageItem("reserv_details", saveObj);
              setSessionStorageItem("secretKey", secretKey);
              setIsActiveTablePage("otp-page");
              router.push("/tablereservation?otp=true", undefined, {
                shallow: true,
              });
            }, 300);
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
    } finally {
      setFormValidationLoading(false);
    }
  };
  const handleDateChange = (e) => {
    setInitialValues((prev) => ({ ...prev, bookingDate: e }));
    getSelectedDay(e);
    const allowBookingAfterDays = tableReservationSettings?.late_booking;

    const minDate = new Date();
    const dateonly = minDate.getDate();
    const allowdate = dateonly + allowBookingAfterDays;
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieFile,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="table_reserv__ position-relative">
      <Fragment>
        <div className="container">
          {isTodayHoliday && (
            <div
              class="alert alert-danger alert-dismissible fade show text-center"
              role="alert"
            >
              <strong>Apologies!</strong> Reservations are temporarily
              unavailable at the moment.
            </div>
          )}

          {loading && isTimingLoading ? (
            <div className="reservation_lottie">
              <Lottie options={defaultOptions} width={200} height={200} />
            </div>
          ) : (
            <>
              {tableReservationSettings?.active === true ? (
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
                        <h3 className="sub_title_">Booking Information</h3>
                        <Calendar
                          className="booking_calendar"
                          minDate={defaultDate}
                          defaultView="month"
                          calendarType="gregory"
                          name="bookingDate"
                          onChange={(e) => handleDateChange(e)}
                          defaultValue={defaultDate}
                          tileDisabled={({ date }) => isHoliday(date)}
                          // tileContent={({ date }) => {
                          //   // Find the holiday reason for this date
                          //   const holiday =
                          //     upcomingHolidays &&
                          //     upcomingHolidays.length != 0 &&
                          //     upcomingHolidays.find((holiday) => {
                          //       const start = new Date(holiday.startTime);
                          //       const end = new Date(holiday.endTime);
                          //       return date >= start && date <= end;
                          //     });

                          //   return holiday ? (
                          //     <div
                          //       className="holiday-reason"
                          //       style={{
                          //         color: "red",
                          //         fontSize: "10px",
                          //         textDecoration: "none",
                          //       }}
                          //     >
                          //       {holiday?.reason ?? "N/A"}
                          //     </div>
                          //   ) : (
                          //     ""
                          //   );
                          // }}
                        />
                        <div className="row mt-3">
                          {/* <div className="col-lg-4 col-md-4 ol-sm-4">
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
                      </div> */}
                          <div className="col-lg-4 col-md-4 ol-sm-4">
                            <div className="form-group">
                              <label
                                htmlFor="bookingTime"
                                className="form-label table_reserv_form_label"
                              >
                                Booking Time
                              </label>
                              {/* <input
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
                        ></input> */}

                              <select
                                name="bookingTime"
                                className={
                                  "form-select table_reserv_form_input_select d-block " +
                                  (isReservErr &&
                                  (!initialValues?.bookingTime ||
                                    initialValues.bookingTime.length === 0)
                                    ? "err__"
                                    : "")
                                }
                                // style={{ width: "100%", display: "block !important" }}
                                onChange={handleChange}
                                value={initialValues?.bookingTime || "0"}
                              >
                                <option value="0" disabled>
                                  Please choose time
                                </option>
                                {timeIntervals &&
                                  timeIntervals.length !== 0 &&
                                  timeIntervals.map((interval, timeIndex) => (
                                    <option value={interval} key={timeIndex}>
                                      {interval &&
                                        Utils.convertTiming(interval)}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            {isReservErr && initialValues.bookingTime == 0 && (
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
                              No of Party Size
                            </label>

                            <div className="inc_dec_wrapper_0291">
                              <div className="incDec_wrapper_0291">
                                <input
                                  type="checkbox"
                                  id="toggle"
                                  min={1}
                                  className="toggle-checkbox"
                                />
                                <div className="counter-container text-center mx-auto">
                                  <label
                                    htmlFor="toggle"
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
                                    htmlFor="toggle"
                                    className="increment-button red"
                                    onClick={handleIncrement}
                                  >
                                    +
                                  </label>
                                </div>
                              </div>
                              <br />
                              <p className="info_txt">
                                * Maximum party size is{" "}
                                {tableReservationSettings?.max_party_size}
                              </p>
                            </div>
                            {isReservErr && initialValues.noOfChairs == 0 && (
                              <span className="reserv_from_err">
                                Select a valid number of chairs!
                              </span>
                            )}
                          </div>
                        </div>
                        <hr />
                        <h3 className="sub_title_">Personal Information</h3>
                        <div className="row">
                          <div className="col-lg-4 col-md-6 ol-sm-12">
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
                                  (isReservErr &&
                                  initialValues.name.length === 0
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
                          <div className="col-lg-4 col-md-6 ol-sm-12">
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
                                  (isReservErr &&
                                  initialValues.email.length === 0
                                    ? "err__"
                                    : "")
                                }
                                onChange={handleChange}
                              ></input>
                            </div>
                            {isReservErr &&
                              initialValues.email.length === 0 && (
                                <span className="reserv_from_err">
                                  Email Address is Required!
                                </span>
                              )}
                          </div>

                          <div className="col-lg-4 col-md-6 ol-sm-12">
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
                                  (isReservErr &&
                                  initialValues.phone.length === 0
                                    ? "err__"
                                    : "")
                                }
                                onChange={validatePhoneNumber}
                                maxLength={15}
                              ></input>
                            </div>
                            {isReservErr &&
                              initialValues.phone.length === 0 && (
                                <span className="reserv_from_err">
                                  Phone Number is Required!
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
                              className="textarea form-control table_reserv_textarea"
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="submit_reserv_btn"
                          disabled={formValidationLoading}
                        >
                          {formValidationLoading === false ? (
                            <Fragment>
                              <span>Proceed to Booking</span>
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
                      </form>
                      {/* <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_CAPTCHA_SITE_KEY}/> */}
                      <div
                        className="g-recaptcha"
                        data-sitekey={RECAPTCHA_SITE_KEY}
                        data-size="invisible"
                      ></div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12 order-lg-2 order-md-2 order-sm-1 pb-2 position-relative">
                    <div className="card timing_card_table_reserv ">
                      {/* <p className="open_">
                  <i className="pe-1">
                    <GrLocation />
                  </i>
                  <span>Location</span>
                </p>
                <p className="location___">
                  Guruviharrr, Kadakkavoor, Thiruvananthapuram
                </p> */}

                      <div className="open_">
                        <i className="pe-1">
                          <Md.MdOutlineRestaurantMenu />
                        </i>
                        <span>Booking info</span>
                        <table className="table reserve_table">
                          <tbody>
                            <tr>
                              <td>Date</td>
                              <td>
                                {initialValues && initialValues?.bookingDate
                                  ? Utils.formatDate(initialValues?.bookingDate)
                                  : Utils.formatDate(new Date())}
                              </td>
                            </tr>
                            <tr>
                              <td>Time</td>
                              <td>
                                {initialValues && initialValues.bookingTime
                                  ? Utils.convertTiming(
                                      initialValues?.bookingTime
                                    )
                                  : "00:00"}
                              </td>
                            </tr>
                            <tr>
                              <td>Chairs</td>
                              <td>{count ?? 0}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/*<p className="open_">
                  <i className="pe-1">
                    <Io.IoTimeOutline />
                  </i>
                  <span>Open Hours</span>
                </p>
                 {loading ? (
                  <span>
                    <strong>Loading.. Please wait!</strong>
                  </span>
                ) : (
                  <div className="timing_cart_reserv">
                    <div className="row">
                      <div className="col-lg-6 col-md-8 col-sm-12">
                        <div
                          className={
                            dayValue === "sunday"
                              ? "day_wrapper_reserv_table --active"
                              : "day_wrapper_reserv_table"
                          }
                        >
                          <p className="day__">Sunday</p>
                          <ul className="reserv_timing__">
                            {tableReservationSettings &&
                              tableReservationSettings.sunday &&
                              tableReservationSettings.sunday.map(
                                (sunday, daykey) => {
                                  return (
                                    <>
                                      <li key={daykey}>
                                        {sunday?.start
                                          ? Utils.convertTiming(sunday?.start)
                                          : "N/A"}{" "}
                                        -{" "}
                                        {sunday?.end
                                          ? Utils.convertTiming(sunday?.end)
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              )}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-8 col-sm-12">
                        <div
                          className={
                            dayValue === "monday"
                              ? "day_wrapper_reserv_table --active"
                              : "day_wrapper_reserv_table"
                          }
                        >
                          <p className="day__">Monday</p>
                          <ul className="reserv_timing__">
                            {tableReservationSettings &&
                              tableReservationSettings.monday &&
                              tableReservationSettings.monday.map((monday) => {
                                return (
                                  <>
                                    <li>
                                      {monday?.start
                                        ? Utils.convertTiming(monday?.start)
                                        : "N/A"}{" "}
                                      -{" "}
                                      {monday?.end
                                        ? Utils.convertTiming(monday?.end)
                                        : "N/A"}
                                    </li>
                                  </>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 col-md-8 col-sm-12">
                        <div
                          className={
                            dayValue === "tuesday"
                              ? "day_wrapper_reserv_table --active"
                              : "day_wrapper_reserv_table"
                          }
                        >
                          <p className="day__">Tuesday</p>
                          <ul className="reserv_timing__">
                            {tableReservationSettings &&
                              tableReservationSettings.tuesday &&
                              tableReservationSettings.tuesday.map(
                                (tuesday) => {
                                  return (
                                    <>
                                      <li>
                                        {tuesday?.start
                                          ? Utils.convertTiming(tuesday?.start)
                                          : "N/A"}{" "}
                                        -{" "}
                                        {tuesday?.end
                                          ? Utils.convertTiming(tuesday?.end)
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              )}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-8 col-sm-12">
                        <div
                          className={
                            dayValue === "wednesday"
                              ? "day_wrapper_reserv_table --active"
                              : "day_wrapper_reserv_table"
                          }
                        >
                          <p className="day__">Wednesday</p>
                          <ul className="reserv_timing__">
                            {tableReservationSettings &&
                              tableReservationSettings.wednesday &&
                              tableReservationSettings.wednesday.map(
                                (wednesday) => {
                                  return (
                                    <>
                                      <li>
                                        {wednesday?.start
                                          ? Utils.convertTiming(
                                              wednesday?.start
                                            )
                                          : "N/A"}{" "}
                                        -{" "}
                                        {wednesday?.end
                                          ? Utils.convertTiming(wednesday?.end)
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-8 col-sm-12">
                        <div
                          className={
                            dayValue === "thursday"
                              ? "day_wrapper_reserv_table --active"
                              : "day_wrapper_reserv_table"
                          }
                        >
                          <p className="day__">Thursday</p>
                          <ul className="reserv_timing__">
                            {tableReservationSettings &&
                              tableReservationSettings.thursday &&
                              tableReservationSettings.thursday.map(
                                (thursday) => {
                                  return (
                                    <>
                                      <li>
                                        {thursday?.start
                                          ? Utils.convertTiming(thursday?.start)
                                          : "N/A"}{" "}
                                        -{" "}
                                        {thursday?.end
                                          ? Utils.convertTiming(thursday?.end)
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              )}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-8 col-sm-12">
                        <div
                          className={
                            dayValue === "friday"
                              ? "day_wrapper_reserv_table --active"
                              : "day_wrapper_reserv_table"
                          }
                        >
                          <p className="day__">Friday</p>
                          <ul className="reserv_timing__">
                            {tableReservationSettings &&
                              tableReservationSettings.friday &&
                              tableReservationSettings.friday.map((friday) => {
                                return (
                                  <>
                                    <li>
                                      {friday?.start
                                        ? Utils.convertTiming(friday?.start)
                                        : "N/A"}{" "}
                                      -{" "}
                                      {friday?.end
                                        ? Utils.convertTiming(friday?.end)
                                        : "N/A"}
                                    </li>
                                  </>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 col-md-8 col-sm-12">
                        <div
                          className={
                            dayValue === "saturday"
                              ? "day_wrapper_reserv_table --active"
                              : "day_wrapper_reserv_table"
                          }
                        >
                          <p className="day__">Saturday</p>
                          <ul className="reserv_timing__">
                            {tableReservationSettings &&
                              tableReservationSettings.saturday &&
                              tableReservationSettings.saturday.map(
                                (saturday) => {
                                  return (
                                    <>
                                      <li>
                                        {saturday?.start
                                          ? Utils.convertTiming(saturday?.start)
                                          : "N/A"}{" "}
                                        -{" "}
                                        {saturday?.end
                                          ? Utils.convertTiming(saturday?.end)
                                          : "N/A"}
                                      </li>
                                    </>
                                  );
                                }
                              )}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6"></div>
                    </div>
                  </div>
                )} */}

                      {/* <button
                  type="button"
                  className="reserv_btn my-3"
                  onClick={() => router.push("/manage-reservation")}
                >
                  <i className="pe-2">
                    <Im.ImSpoonKnife />
                  </i>
                  Manage Reservation
                </button> */}
                    </div>
                    <div className="poweredBy_ text-center" id="main___">
                      <span>Powered by Foodpage</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="disable-main">
                    <div className="disabled_wrapper">
                      <Image
                        src={TableReservDisabled}
                        height={200}
                        width={200}
                      />
                    </div>
                    <br />
                    <div className="container">
                      <p className="txt_content">
                        We sincerely apologize for the inconvenience.
                        Unfortunately, table reservations are unavailable at the
                        moment. Please check back with us later. <br />{" "}
                        <strong>Thank you for your understanding.</strong>
                      </p>
                      <br />
                      <p className="text-center fs-6 user-select-none">
                        <i>For further queries, contact Restaurent!</i>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Fragment>
    </div>
  );
}

export default TableReservationForm;
