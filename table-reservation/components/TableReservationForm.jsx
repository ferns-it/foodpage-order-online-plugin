"use client";
import React, {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Go from "react-icons/go";
import * as Tb from "react-icons/tb";
import * as Lu from "react-icons/lu";
import * as Fa from "react-icons/fa6";
import * as Md from "react-icons/md";
import * as Im from "react-icons/im";
import { GrLocation } from "react-icons/gr";
import { TableReservationContext } from "../context/TableReservationContext";
import Utils from "../utils/Utils";
import { toast, Toaster } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  redirectToLocation,
  removeSessionStorageItem,
  setSessionStorageItem,
} from "../../_utils/ClientUtils";
import axios from "axios";
import Lottie from "react-lottie";
import lottieFile from "../assets/lottie/Animation - 1734505645259.json";
import Image from "next/image";
import TableReservDisabled from "../assets/table-reservation-disabled.png";
import dayjs from "dayjs";
import { AppContext } from "../../order-online-page/context";
import { jwtDecode } from "jwt-decode";

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
  const { settings, fetchReservationList } = useContext(AppContext);
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
    completeReservation,
    getReservationDetailsEmail,
    reservationDetails,
    setReservationDetails,
  } = useContext(TableReservationContext);

  const [count, setCount] = useState(1);
  const [showManageReserv, setShowManageReserv] = useState(false);
  const [isReservErr, setIsReservErr] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [dayValue, setDayValue] = useState(null);
  const [timeIntervals, setTimeIntervals] = useState(null);
  const [formValidationLoading, setFormValidationLoading] = useState(false);
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [isTodayHoliday, setIsTodayHoliday] = useState(false);
  const [reservEmail, setReservEmail] = useState("");
  const [manageReservLoading, setManageReservLoading] = useState(false);
  const [holidayIntervals, setHolidayIntervals] = useState([]);

  const memoizedHolidayIntervals = useMemo(() => {
    return generateHolidayIntervals();
  }, [upcomingHolidays, tableReservationSettings]);

  useEffect(() => {
    setInitialValues((prev) => ({ ...prev, bookingDate: defaultDate }));
  }, [upcomingHolidays]);

  useEffect(() => {
    if (!shopId) return;
    getShopTiming(shopId);
  }, [shopId]);

  useEffect(() => {
    setInitialValues((prev) => ({ ...prev, noOfChairs: count }));
  }, [count]);

  useEffect(() => {
    const reservData = getSessionStorageItem("reservationData");

    if (reservData && reservData.length != 0) {
      const parsedData = JSON.parse(reservData) ?? null;

      if (parsedData && typeof parsedData == "object") {
        setInitialValues({
          name: parsedData?.name ?? "",
          email: parsedData?.email,
          phone: parsedData?.phone,
          bookingTime: parsedData?.bookingTime,
          bookingDate: parsedData?.bookingDate,
          noOfChairs: parsedData?.noOfChairs,
          message: parsedData?.message,
        });
        const pickedDate = new Date(parsedData?.bookingDate) ?? new Date();

        setDefaultDate(pickedDate);
      }
    }
  }, []);

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

    // setDefaultDate(nextAvailableDate);
    // setInitialValues((prev) => ({ ...prev, bookingDate: nextAvailableDate }));
  }, [upcomingHolidays]);

  useEffect(() => {
    if (!tableReservationSettings || !dayValue || !holidayIntervals) return;
    fetchIntervals();
  }, [tableReservationSettings, dayValue, initialValues]);

  const fetchIntervals = () => {
    const todaysTiming = tableReservationSettings[dayValue];

    if (!todaysTiming || todaysTiming.length === 0) {
      setTimeIntervals([]);
      return;
    }

    const timeInterval =
      typeof tableReservationSettings?.time_interval === "string"
        ? parseInt(tableReservationSettings?.time_interval)
        : tableReservationSettings?.time_interval;

    const findIntervals = [
      ...new Set(
        todaysTiming.flatMap((time) =>
          Utils.getTimeIntervals(time.start, time.end, timeInterval)
        )
      ),
    ];

    setHolidayIntervals(memoizedHolidayIntervals);

    const CheckHolidate =
      holidayIntervals &&
      holidayIntervals.length != 0 &&
      holidayIntervals.filter((x) =>
        dayjs(x.date).isSame(dayjs(initialValues?.bookingDate), "day")
      );

    if (CheckHolidate && CheckHolidate.length != 0) {
      const currentHoliday = CheckHolidate[0];

      const filteredIntervals =
        currentHoliday.intervals.length === 0
          ? []
          : findIntervals.filter(
              (time) => !currentHoliday.intervals.includes(time)
            );

      return setTimeIntervals(filteredIntervals);
    }

    setTimeIntervals(findIntervals);
  };

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

  const isHoliday = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    return (
      (holidayIntervals &&
        holidayIntervals.length != 0 &&
        holidayIntervals?.some(
          (holiday) =>
            holiday.date === dateKey && holiday.intervals.length === 0
        )) ||
      false
    );
  };

  function generateHolidayIntervals() {
    const holidayIntervals = [];
    const interval = tableReservationSettings?.time_interval ?? 15;

    upcomingHolidays?.forEach((holiday) => {
      let start = new Date(holiday.startTime);
      let end = new Date(holiday.endTime);

      const startDateKey = start.toISOString().split("T")[0];
      const endDateKey = end.toISOString().split("T")[0];

      if (startDateKey === endDateKey) {
        // Case: Same-Day Holiday (Only block from startTime to endTime)
        let existingEntry = holidayIntervals.find(
          (entry) => entry.date === startDateKey
        );
        if (!existingEntry) {
          existingEntry = { date: startDateKey, intervals: [] };
          holidayIntervals.push(existingEntry);
        }

        let timePointer = new Date(holiday.startTime);
        const minutes = timePointer.getMinutes();
        const roundedMinutes = Math.ceil(minutes / interval) * interval;
        timePointer.setMinutes(roundedMinutes, 0, 0);

        let limit = new Date(holiday.endTime);

        while (timePointer <= limit) {
          existingEntry.intervals.push(timePointer.toTimeString().slice(0, 5));
          timePointer = new Date(timePointer.getTime() + interval * 60 * 1000);
        }
      } else {
        // Case: Multi-Day Holiday
        while (start <= end) {
          const dateKey = start.toISOString().split("T")[0];
          let existingEntry = holidayIntervals.find(
            (entry) => entry.date === dateKey
          );
          if (!existingEntry) {
            existingEntry = { date: dateKey, intervals: [] };
            holidayIntervals.push(existingEntry);
          }

          let timePointer, limit;

          if (dateKey === startDateKey) {
            // First Day of Holiday (Start from startTime to end of the day)
            timePointer = new Date(holiday.startTime);
            const minutes = timePointer.getMinutes();
            const roundedMinutes = Math.ceil(minutes / interval) * interval;
            timePointer.setMinutes(roundedMinutes, 0, 0);

            limit = new Date(`${dateKey}T23:59:00`);
          } else if (dateKey === endDateKey) {
            // Last Day of Holiday (Start from midnight to endTime)
            timePointer = new Date(`${dateKey}T00:00:00`);
            limit = new Date(holiday.endTime);
          } else {
            // Full-Day Holiday (Block entire day)
            existingEntry.intervals = [];
            start.setDate(start.getDate() + 1);
            start.setHours(0, 0, 0, 0);
            continue;
          }

          // Generate intervals within the time range
          while (timePointer <= limit) {
            existingEntry.intervals.push(
              timePointer.toTimeString().slice(0, 5)
            );
            timePointer = new Date(
              timePointer.getTime() + interval * 60 * 1000
            );
          }

          // Move to the next day at midnight
          start.setDate(start.getDate() + 1);
          start.setHours(0, 0, 0, 0);
        }
      }
    });

    return holidayIntervals;
  }

  const reservationValidation = async (bookingTime, chairs) => {
    const requestBody = {
      bookingTime,
      chairs,
      shopId: process.env.SHOP_ID,
      shopUrl: process.env.SHOP_URL,
    };

    const url = "https://shopadmin.vgrex.com/settings/validate-enquiry";

    try {
      const response = await axios.post(url, requestBody);
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      const errMsg =
        error.response?.data?.errormessage || "Something went wrong";
      toast.error(errMsg);

      return false;
    }
  };

  const findNextAvailableDay = (date) => {
    while (isHoliday(date)) {
      date.setDate(date.getDate() + 1);
    }
    return date;
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
    setFormValidationLoading(true);

    try {
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

      const token = getLocalStorageItem("userToken");

      const havAdvance =
        settings?.tableReservationSettings.haveAdvance === "Yes" ? true : false;

      let reserAdvAmt = 0;

      if (havAdvance) {
        reserAdvAmt = settings?.tableReservationSettings.advanceAmount;
      }
      setSessionStorageItem("reservationData", JSON.stringify(initialValues));

      if (token == null || token == undefined) {
        toast.success("Please Complete the Authentication!");
        redirectToLocation("/reservation-login");
      } else {
        //** Check if the settings has advance amout for reservation */
        if (havAdvance) {
          redirectToLocation(`/reservation-checkout?advance=${reserAdvAmt}`);
          return;
        } else {
          // await sendReservationOTP(payload, {
          //   onSuccess: (res) => {
          //     sessionStorage.setItem("hashcode", md5Num);
          //     // localStorage.setItem("pageState");
          //     setSecretKey(md5Num);
          //     const errStatus = res.data.error;

          //     if (errStatus == false) {
          //       const saveObj =
          //         initialValues && typeof initialValues == "object"
          //           ? JSON.stringify(initialValues)
          //           : initialValues;

          //       toast.success("OTP send successfully!");

          //       setSessionStorageItem("reserv_details", saveObj);
          //       setSessionStorageItem("secretKey", secretKey);
          //       setIsActiveTablePage("otp-page");
          //     } else {
          //       toast.error("OTP not send!");
          //     }
          //   },
          //   onFailed: (err) => {
          //     toast.error("Error on sending OTP");
          //     console.log("OTP ERROR", err);
          //   },
          //   headers: headers,
          // });
          completeNewReservation();
        }
      }
    } finally {
      setFormValidationLoading(false);
    }
  };

  const completeNewReservation = async () => {
    if (initialValues == null || initialValues == undefined) {
      toast.error("Please enter the reservation values and try again!");
      return;
    }
    const mergedBooking = Utils.mergeBookingDateTime(
      initialValues?.bookingDate,
      initialValues?.bookingTime
    );
    // const decodeBase64 = (str) => {
    //   try {
    //     return JSON.parse(atob(str));
    //   } catch (e) {
    //     console.error("Invalid Base64 string", e);
    //     return null;
    //   }
    // };

    // const parts = token.split(".");

    const token = getLocalStorageItem("userToken");
    const tokenData = jwtDecode(token);
    const userId = tokenData?.data?.userID;
    const parsedId = userId && typeof userId == "string" ? Number(userId) : 0;

    const payload = {
      shopID: shopId,
      userID: parsedId,
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
      onSuccess: async (res) => {
        toast.success("Your request has been submitted successfully!");
        setSecretKey("");
        removeSessionStorageItem("reserv_details");
        removeSessionStorageItem("reservationData");
        setInitialValues({
          name: "",
          email: "",
          phone: "",
          bookingTime: 0,
          bookingDate: "",
          noOfChairs: 0,
          message: "",
        });
        await fetchReservationList(token);
        setIsActiveTablePage("success-page");
      },
      onFailed: (err) => {
        console.log(err);
      },
      headers,
    });
  };
  const handleDateChange = (e) => {
    setInitialValues((prev) => ({ ...prev, bookingDate: e }));
    getSelectedDay(e);

    const allowBookingAfterDays = tableReservationSettings?.late_booking;
    const minDate = new Date();
    const dateonly = minDate.getDate();
    const allowdate = dateonly + allowBookingAfterDays;

    // Check if the selected date matches any holiday
    const selectedDateStr = e.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    const holidayMatch = holidayIntervals.find(
      (holiday) => holiday.date === selectedDateStr
    );

    // Filter out holiday intervals if there's a match
    if (holidayMatch) {
      const filteredIntervals = timeIntervals.filter(
        (time) => !holidayMatch.intervals.includes(time)
      );
      setTimeIntervals(filteredIntervals);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieFile,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const getReservationDetails = async (e) => {
    e.preventDefault();

    try {
      setManageReservLoading(true);
      if (reservEmail && reservEmail.length === 0) {
        toast.error("Email is required!");
        return;
      }

      const type = "upcoming";
      await getReservationDetailsEmail(reservEmail, type, {
        onSuccess: (res) => {
          if (res?.data?.error === false) {
            const reserVData = res?.data?.data?.enquiryList;
            console.log(reserVData,"data")
            if (reserVData && reserVData.length == 0) {
              toast.error("No reservations found!");
              return;
            }
            setReservationDetails(reserVData);
            setSessionStorageItem("reservData", JSON.stringify(reserVData));
            router.push(`/reservation-list?email=${reservEmail}`);
          } else {
            toast.error("No reservations found!");
          }
        },
        onFailed: (err) => {
          console.log("Error on fetching reservation details", err);
        },
      });
    } finally {
      setManageReservLoading(false);
    }
  };

  return (
    <div className="table_reserv__ position-relative">
      <Toaster />
      <Fragment>
        <div className="container">
          {loading && isTimingLoading ? (
            <div className="reservation_lottie">
              <Lottie options={defaultOptions} width={200} height={200} />
            </div>
          ) : (
            <>
              {loading === false &&
                tableReservationSettings?.active === true && (
                  <div className="row">
                    <div className="col-lg-8 col-md-8 col-sm-12 order-lg-1 order-md-1 order-sm-2">
                      <div className="card table_reservation_card">
                        <h3 className="table-reservation-form-head">
                          Table Reservation Form
                        </h3>
                        {holidayIntervals &&
                          holidayIntervals.length !== 0 &&
                          holidayIntervals.some((x) => {
                            let holidayDate = new Date(x.date)
                              .toISOString()
                              .split("T")[0];
                            let bookingDate = new Date(
                              initialValues?.bookingDate
                            )
                              .toISOString()
                              .split("T")[0];

                            if (holidayDate === bookingDate) {
                              let startTime = new Date(
                                x.startTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                              let endTime = new Date(
                                x.endTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              });

                              return (
                                <p className="text-danger fw-bold text-center user-select-none mt-2">
                                  Reservation is not available today from{" "}
                                  {startTime} to {endTime}.
                                </p>
                              );
                            }
                            return false;
                          })}

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
                                  <span className="reserv_from_err text-danger">
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
                                    "form-control table_reserv_form_input_select d-block " +
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
                                {isReservErr &&
                                  initialValues.bookingTime == 0 && (
                                    <span className="reserv_from_err text-danger">
                                      Booking Time is Required!
                                    </span>
                                  )}
                              </div>
                              {timeIntervals && timeIntervals.length == 0 && (
                                <span className="text-danger fw-bold user-select-none m-2">
                                  No Slots Available!
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
                                <span className="reserv_from_err text-danger">
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
                                  value={initialValues?.name}
                                ></input>
                              {isReservErr &&
                                initialValues.name.length === 0 && (
                                  <span className="reserv_from_err text-danger">
                                    Name is Required!
                                  </span>
                                )}
                              </div>
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
                                  value={initialValues?.email}
                                ></input>
                                {isReservErr &&
                                  initialValues.email.length === 0 && (
                                    <span className="reserv_from_err text-danger">
                                      Email Address is Required!
                                    </span>
                                  )}
                              </div>
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
                                  value={initialValues?.phone}
                                ></input>
                                {isReservErr &&
                                  initialValues.phone.length === 0 && (
                                    <span className="reserv_from_err text-danger text-danger">
                                      Phone Number is Required!
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="row my-4">
                            <div className="col-12">
                              <label
                                htmlFor="message"
                                className="form-label table_reserv_form_label"
                              >
                                Message to Restaurant
                              </label>
                              <textarea
                                name="message"
                                id=""
                                className="textarea form-control table_reserv_textarea"
                                onChange={handleChange}
                                value={initialValues?.message}
                              ></textarea>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="submit_reserv_btn"
                            disabled={
                              formValidationLoading || reservationLoading
                            }
                          >
                            {formValidationLoading === false &&
                            reservationLoading === false ? (
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
                                    ? Utils.formatDate(
                                        initialValues?.bookingDate
                                      )
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

                        <button
                          type="button"
                          className="reserv_btn my-3"
                          onClick={() => setShowManageReserv(!showManageReserv)}
                        >
                          <i className="pe-2">
                            <Im.ImSpoonKnife />
                          </i>
                          Manage Reservation
                        </button>
                        {showManageReserv && (
                          <form onSubmit={(e) => getReservationDetails(e)}>
                            <div className="form-group">
                              <p className="sub_title_">
                                Use the form below to find your reservation
                              </p>
                              <label
                                htmlFor="reservEmail"
                                className="form-label"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="reservEmail"
                                className="form-control"
                                onChange={(e) => setReservEmail(e.target.value)}
                                value={reservEmail}
                              />

                              <button
                                type="submit"
                                className="reserv_btn mt-3 ms-1"
                                style={{ float: "left" }}
                                disabled={manageReservLoading}
                              >
                                {!manageReservLoading ? (
                                  <>
                                    <i className="pe-2">
                                      <Md.MdTableBar />
                                    </i>
                                    View Reservation
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <span
                                      class="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>{" "}
                                    please wait...
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                      {!isTimingLoading &&
                        upcomingHolidays &&
                        upcomingHolidays.length != 0 && (
                          <div className="reservationHolidays">
                            <div className="card timing_card_table_reserv ">
                              <div className="open_">
                                <i className="pe-1">
                                  <Fa.FaDoorClosed />
                                </i>
                                <span>Reservation Holidays</span>
                              </div>

                              {upcomingHolidays.map((item, idx6) => {
                                const [startDate, startTime] =
                                  item.startTime.split(" ");
                                const [endDate, endTime] =
                                  item.endTime.split(" ");

                                return (
                                  <div className="card holidaycard" key={idx6}>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <i>
                                        <Fa.FaMartiniGlass />
                                      </i>
                                      <p className="holi_date m-0 fw-bold">
                                        {startDate && startDate.length != 0
                                          ? Utils.formatDate(startDate)
                                          : ""}{" "}
                                        -{" "}
                                        {startTime && startTime.length != 0
                                          ? Utils.convertTiming(startTime)
                                          : ""}{" "}
                                      </p>
                                      <i>
                                        <Lu.LuArrowLeftRight />
                                      </i>
                                      <p className="holi_time m-0 fw-bold">
                                        {endDate && endDate.length != 0
                                          ? Utils.formatDate(endDate)
                                          : ""}
                                        -{" "}
                                        {endTime && endTime.length != 0
                                          ? Utils.convertTiming(endTime)
                                          : ""}
                                      </p>
                                    </div>
                                    {item?.reason &&
                                      item?.reason.length != 0 && (
                                        <div className="d-flex">
                                          <i>
                                            <Tb.TbMessage2Exclamation />
                                          </i>{" "}
                                          <span>{item?.reason ?? ""}</span>
                                        </div>
                                      )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      <div className="poweredBy_ text-center" id="main___">
                        <span>Powered by Foodpage</span>
                      </div>
                    </div>
                  </div>
                )}
              {tableReservationSettings &&
                tableReservationSettings?.active === false && (
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
                          Unfortunately, table reservations are unavailable at
                          the moment. Please check back with us later. <br />{" "}
                          <strong>Thank you for your understanding.</strong>
                        </p>
                        <br />
                        <p className="text-center fs-6 user-select-none">
                          <i>For further queries, contact Restaurant!</i>
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
