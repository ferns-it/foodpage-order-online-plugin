import React, { Fragment, useContext, useEffect, useState } from "react";
import { TableReservationContext } from "../context/TableReservationContext";
import OtpInput from "react-otp-input";
import { MdTableBar } from "react-icons/md";
import * as Go from "react-icons/go";
import * as Fa from "react-icons/fa";
import Utils from "../utils/Utils";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  getSessionStorageItem,
  removeSessionStorageItem,
} from "../../_utils/ClientUtils";

export const mergeBookingDateTime = (bookingDate, bookingTime) => {
  const date = new Date(bookingDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const timeWithSeconds = bookingTime.includes(":")
    ? bookingTime
    : `${bookingTime}:00`;

  const formattedDateTime = `${year}-${month}-${day} ${timeWithSeconds}`;

  return formattedDateTime;
};

function ReservOtp({ setIsActiveTablePage, encryptToMD5, shopId }) {
  const router = useRouter();
  const {
    initialValues,
    completeReservation,
    reservationLoading,
    secretKey,
    setSecretKey,
    sendReservationOTP,
    setInitialValues,
  } = useContext(TableReservationContext);
  const [reservOTP, setResertOTP] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

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

  // const {otp,
  //     setOtp,
  //     clearOtp}=useContext(TableReservationContext)
  // useEffect(()=>{
  //     const pageStored =localStorage.setItem("pageState");
  //     if(pageStored){
  //         setIsActiveTablePage(pageStored)
  //     }
  // },[setIsActiveTablePage])
  // useEffect(() => {
  //     const storedPageState = localStorage.getItem('pageState');
  //     if (storedPageState) {
  //         setIsActiveTablePage(storedPageState); // Set the page state
  //       }
  //     }, [setIsActiveTablePage]
  // );
  const resendOTP = async () => {
    const oneTimePass = Utils.generateOTP();
    const md5Num = encryptToMD5(oneTimePass);
    if (!initialValues) {
      toast.error("Missing Credentials, Please try again!");
    }
    const payload = {
      shopID: shopId,
      name: initialValues.name,
      email: initialValues.email,
      otp: oneTimePass,
      phone: initialValues.phone,
    };

    const headers = {
      "x-secretkey": process.env.FOODPAGE_RESERVATION_SECRET_KEY,
    };

    try {
      setResendLoading(true);
      await sendReservationOTP(payload, {
        onSuccess: (res) => {
          sessionStorage.setItem("hashcode", md5Num);
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
    } finally {
      setResendLoading(false);
    }
  };

  const completeNewReservation = async () => {
    const mergedBooking = mergeBookingDateTime(
      initialValues?.bookingDate,
      initialValues?.bookingTime
    );
    const payload = {
      shopID: shopId,
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
      baseUrl: "http://foodpage.co.uk/",
      source: "NextJs",
    };

    debugger;

    const headers = {
      "x-secretkey": process.env.FOODPAGE_RESERVATION_SECRET_KEY,
    };

    await completeReservation(payload, {
      onSuccess: (res) => {
        console.log(res);
        toast.success("OTP has been verified!");
        setSecretKey("");
        removeSessionStorageItem("reserv_details");
        setTimeout(() => {
          setIsActiveTablePage("success-page");
        }, 1000);
      },
      onFailed: (err) => {
        console.log(err);
      },
      headers,
    });
  };
  const validateOTP = async () => {
    const encryptOTP = encryptToMD5(reservOTP);

    if (secretKey.length == 0) {
      console.log("OTP IS NOT DECRYPTED");
    }
    if (secretKey === encryptOTP) {
      await completeNewReservation();
    } else {
      toast.error("Invalid OTP!");
    }
  };

  const handleNavigation = () => {
    router.push(
      {
        pathname: "/tablereservation",
      },
      undefined,
      { shallow: true }
    );
    setTimeout(() => {
      setIsActiveTablePage("reservation-form");
    }, 200);
  };

  return (
    <>
      <section className="table_reserv__">
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-8">
              <button className="go_back" onClick={handleNavigation}>
                <Go.GoArrowLeft />
              </button>
              <div className="card table_reservation_card">
                <h3 className="table-reservation-form-head">
                  VERIFICATION CODE
                </h3>
                <p className="table_reserv_info_sub_head text-center">
                  Your OTP has been send to your mail addesss{" "}
                  <strong>{initialValues?.email ?? "N/A"}</strong>
                </p>
                <div className="otp_validation_reserv">
                  <OtpInput
                    value={reservOTP}
                    onChange={(e) => setResertOTP(e)}
                    numInputs={6}
                    // renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                  />
                  <p className="resend_otp_reservv">
                    Didn't get any OTP? <br />
                    {!resendLoading ? (
                      <span onClick={resendOTP}>Resend OTP</span>
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
                </div>
                <label htmlFor="policy" className="text-center priv_policy">
                  <input type="checkbox" name="" id="policy" /> I have read and
                  accept the <a href=""> booking terms & privacy policy</a>.
                </label>
                <br />
                <button
                  type="button"
                  className="reserv_otp_validation_btn mb-3"
                  onClick={validateOTP}
                  disabled={reservationLoading}
                >
                  {reservationLoading === false ? (
                    <Fragment>
                      <i className="pe-2">
                        <Fa.FaCheckCircle />
                      </i>
                      <span>Confirm Booking</span>
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
            <div className="col-4">
              <div className="card timing_card_table_reserv ">
                <p className="open_">
                  <i className="pe-1">
                    <MdTableBar />
                  </i>
                  <span>Reservation Details</span>
                </p>
                <table className="reserv_timing_table table">
                  <tr>
                    <td className="tbl_head">Booking Date</td>
                    <td>
                      {initialValues && initialValues?.bookingDate
                        ? Utils.formatDate(initialValues?.bookingDate)
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="tbl_head">Booking Time</td>
                    <td>{initialValues?.bookingTime ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="tbl_head">Name</td>
                    <td>{initialValues?.name ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="tbl_head">Email Address</td>
                    <td>{initialValues?.email ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="tbl_head">Phone</td>
                    <td>{initialValues?.phone ?? "N/A"}</td>
                  </tr>

                  <tr>
                    <td className="tbl_head">people</td>
                    <td>{initialValues?.noOfChairs ?? "N/A"}</td>
                  </tr>
                  {initialValues && initialValues.message && (
                    <tr>
                      <td className="tbl_head">Message</td>
                      <td>{initialValues?.message ?? "N/A"}</td>
                    </tr>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ReservOtp;
