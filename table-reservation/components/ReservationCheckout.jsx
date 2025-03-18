"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  redirectToLocation,
  removeSessionStorageItem,
} from "../../_utils/ClientUtils";

import { Toaster } from "react-hot-toast";

import { jwtDecode } from "jwt-decode";

import * as Ci from "react-icons/ci";
import * as Pi from "react-icons/pi";
import * as Tb from "react-icons/tb";
import Utils from "../utils/Utils";
import { AppContext } from "../../order-online-page/context";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentElementOrderOnline from "../../order-online-page/components/StripePaymentElementOrderOnline";
import { toast } from "react-toastify";
import { TableReservationContext } from "../context/TableReservationContext";

function ReservationCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    paymentData,
    setStripeClientSecret,
    stripePaymentClientSecret,
    stripePromise,
    options,
    setPaymentData,
    paymentError,
    createReservPaymentIntent,
    settings,
    fetchReservationList,
  } = useContext(AppContext);
  const { initialValues, setSecretKey, completeReservation } = useContext(
    TableReservationContext
  );
  const [intentLoading, setIntentLoading] = useState(false);
  const [reservationData, setReservationData] = useState({
    name: "",
    email: "",
    phone: "",
    bookingDate: "",
    bookingTime: "",
    noOfChairs: 0,
    message: "",
    price: 0,
  });

  useEffect(() => {
    const reservValue = getSessionStorageItem("reservationData");
    if (reservValue && reservValue.length !== 0) {
      const parsedData = JSON.parse(reservValue);
      setReservationData(parsedData);
    }
  }, []);

  useEffect(() => {
    if (!settings) return;

    const price = settings?.tableReservationSettings?.advanceAmount;
    const actualPrice =
      price && price.length !== 0 && typeof price === "string"
        ? Number(price)
        : 0;

    setReservationData((prev) => ({ ...prev, price: actualPrice }));
  }, [settings]);

  const createPaymentIntentRequest = async () => {
    if (reservationData.price <= 0) {
      toast.error(`Invalid Price amount!`);
      return;
    }

    if (reservationData.noOfChairs <= 0) {
      toast.error(`Minimum amount for Party size is 1`);
      return;
    }

    if (paymentData == null) {
      try {
        let headers = {
          "x-secretkey": process.env.FOODPAGE_RESERVATION_SECRET_KEY,
        };
        setIntentLoading(true);

        const payload = {
          chair: reservationData.noOfChairs,
          shopID: process.env.SHOP_ID,
        };

        await createReservPaymentIntent(payload, {
          headers: headers,
          onSuccess: (res) => {
            setPaymentData(res);
            const result = res?.data?.data?.paymentIntent?.client_secret;
            // debugger;
            if (result != null) {
              setStripeClientSecret(result);
            }
          },

          onFailed: (error) => {
            toast.error(error?.message);
          },
        });
      } finally {
        setIntentLoading(false);
      }
    }
  };

  // const price = searchParams.get("advance");

  const completeNewReservation = async () => {
    const mergedBooking = Utils.mergeBookingDateTime(
      reservationData?.bookingDate,
      reservationData?.bookingTime
    );
    const token = getLocalStorageItem("userToken");

    if (reservationData.price && reservationData.price <= 0) {
      toast.error("Invalid price rate!");
      return;
    }
    const advAmt = reservationData.price
      ? Math.round(Number(reservationData.price) * 100)
      : 0;

    const data = paymentData?.data?.data;

    const tokenData = jwtDecode(token);

    const userId = tokenData?.data.userID;
    const parsedId = userId && typeof userId == "string" ? Number(userId) : 0;

    const payload = {
      shopID: process.env.SHOP_ID,
      userID: parsedId,
      name: reservationData?.name,
      phone: reservationData?.phone,
      email: reservationData?.email,
      totalChair: reservationData?.noOfChairs,
      reservationDateTime: mergedBooking,
      advancePayment: "Yes",
      advanceAmount: advAmt,
      paymentMethod: "STRIPE",
      transactionID: data?.paymentIntent?.id,
      message: reservationData?.message,
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
        removeSessionStorageItem("reservationData");
        await fetchReservationList(token);
        setTimeout(() => {
          redirectToLocation("/");
        }, 1000);
      },
      onFailed: (err) => {
        console.log(err);
      },
      headers,
    });
  };

  return (
    <>
      <Toaster />
      <div className="checkout7821_page">
        <div className="checkout7821_container">
          <div className="checkout7821_header">
            <h1>Complete Your Reservation</h1>
            <p>Review details and confirm with payment</p>
          </div>

          <div className="checkout7821_confirmation_banner">
            <div className="checkout7821_confirmation_icon">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p className="checkout7821_confirmation_text">
                Please review your details and complete payment to confirm
              </p>
            </div>
          </div>

          <div className="checkout7821_details_section">
            <div className="checkout7821_section_title">
              {/* <Calendar className="checkout7821_section_icon" /> */}
              <h2>Reservation Details</h2>
            </div>

            <div className="checkout7821_special_requests">
              <div className="checkout7821_reservation_info">
                <h3>Your Reservation</h3>
                <div className="row">
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="checkout7821_info_item">
                      <div className="checkout7821_info_icon">
                        <Pi.PiUserCircle />
                      </div>
                      <div>
                        <p className="checkout7821_info_label">Name</p>
                        <p className="checkout7821_info_value">
                          {reservationData?.name}
                        </p>
                      </div>
                    </div>

                    <div className="checkout7821_info_item">
                      <div className="checkout7821_info_icon">
                        <Ci.CiMail />
                      </div>
                      <div>
                        <p className="checkout7821_info_label">Email</p>
                        <p className="checkout7821_info_value">
                          {reservationData?.email}
                        </p>
                      </div>
                    </div>

                    <div className="checkout7821_info_item">
                      <div className="checkout7821_info_icon">
                        <Ci.CiPhone />
                      </div>
                      <div>
                        <p className="checkout7821_info_label">Phone</p>
                        <p className="checkout7821_info_value">
                          {reservationData?.phone}
                        </p>
                      </div>
                    </div>

                    <div className="checkout7821_info_item">
                      <div className="checkout7821_info_icon">
                        <Tb.TbReceiptPound />
                      </div>
                      <div>
                        <p className="checkout7821_info_label">
                          Advance Amount
                        </p>
                        <p className="checkout7821_info_value">
                          £{reservationData?.price ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="checkout7821_info_item">
                      <div className="checkout7821_info_icon">
                        <Ci.CiCalendar />
                      </div>
                      <div>
                        <p className="checkout7821_info_label">Date</p>
                        <p className="checkout7821_info_value">
                          {reservationData?.bookingDate &&
                          reservationData?.bookingDate.length != 0
                            ? Utils.formatDate(reservationData?.bookingDate)
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="checkout7821_info_item">
                      <div className="checkout7821_info_icon">
                        <Ci.CiClock2 />
                      </div>
                      <div>
                        <p className="checkout7821_info_label">Time</p>
                        <p className="checkout7821_info_value">
                          {reservationData?.bookingTime &&
                          reservationData?.bookingTime.length != 0
                            ? Utils.convertTiming(reservationData?.bookingTime)
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="checkout7821_info_item">
                      <div className="checkout7821_info_icon">
                        <Pi.PiChairLight />
                      </div>
                      <div>
                        <p className="checkout7821_info_label">Party Size</p>
                        <p className="checkout7821_info_value">
                          {reservationData?.noOfChairs}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(!stripePaymentClientSecret ||
              stripePaymentClientSecret.length == 0) && (
              <button
                type="button"
                className="btn btn-warning mx-auto d-block"
                onClick={createPaymentIntentRequest}
                disabled={intentLoading}
              >
                {`Continue Payment of £${reservationData?.price ?? 0}`}
              </button>
            )}

            <br />

            {stripePaymentClientSecret &&
              stripePaymentClientSecret.length != 0 && (
                <div className="payement_method checkout_form mt-3 pt-3 card p-3 m-1">
                  <Elements stripe={stripePromise} options={options}>
                    <StripePaymentElementOrderOnline
                      paymentSuccess={async (intentResult) => {
                        await completeNewReservation();
                      }}
                      paymentFailure={(err) => {
                        toast.error(err.message);
                      }}
                      formState={reservationData}
                      paymentMethod=""
                    />
                  </Elements>
                </div>
              )}
          </div>

          <div className="checkout7821_footer">
            <p>Please arrive 10 minutes before your reservation time.</p>
            <p>
              For any changes or cancellations, please contact us at least 24
              hours in advance.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReservationCheckout;
