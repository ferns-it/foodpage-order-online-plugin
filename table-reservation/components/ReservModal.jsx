"use client";
import React, { Fragment, useContext, useEffect, useRef } from "react";
import "../style/style.css";
import "../../order-online-page/style/order-online-style.css"; //? style from order online
import CryptoJS from "crypto-js";
import { TableReservationContext } from "../context/TableReservationContext";
import toast from "react-hot-toast";
import * as Io5 from "react-icons/io5";
import * as Gr from "react-icons/gr";
import { appContext } from "../../order-online-page/context";
import Utils from "../utils/Utils";

function ReservModal(props) {
  const modalRef = useRef(null);

  const {
    cancelReservation,
    reservationLoading,
    getReservationDetails,
    tableReservationSettings,
  } = useContext(TableReservationContext);

  const reservAction = props.action;

  useEffect(() => {
    if (props.showModal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKeyPress);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKeyPress);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [props.showModal]);

  useEffect(() => {
    if (!props.bookingDate || !props.bookingTime) return;

    const mergedDateTime = Utils.mergeBookingDateTime(
      props.bookingDate,
      props.bookingTime
    );
  }, [props]);

  const handleClickOutside = async (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      props.setShowModal(false);
    }
  };

  const handleEscKeyPress = (event) => {
    if (event.keyCode === 27) {
      props.setShowModal(false);
    }
  };

  const lateCancel =
    tableReservationSettings && tableReservationSettings?.late_cancel
      ? tableReservationSettings?.late_cancel
      : 0;

  const validateLateCancel = () => {
    const lateCancelMinutes = parseInt(lateCancel);
    if (isNaN(lateCancelMinutes) || lateCancelMinutes < 0) {
      console.log("Invalid lateCancel value");
      return false;
    }

    const bookingDate = props.bookingDate;
    const bookingTime = props.bookingTime;
    if (!bookingDate || !bookingTime) return false;

    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);

    if (isNaN(bookingDateTime)) {
      console.log("Invalid booking date or time format");
      return false;
    }

    const now = new Date();
    const isToday =
      now.getFullYear() === bookingDateTime.getFullYear() &&
      now.getMonth() === bookingDateTime.getMonth() &&
      now.getDate() === bookingDateTime.getDate();

    const timeDifferenceInMinutes = Math.round(
      (bookingDateTime - now) / (1000 * 60)
    );

    if (timeDifferenceInMinutes <= lateCancelMinutes) {
      const hours = Math.floor(lateCancelMinutes / 60);
      const remainingMinutes = lateCancelMinutes % 60;
      const message = hours <= 0 ? lateCancelMinutes : hours;
      console.log(
        `Cannot cancel. The booking is within ${hours} hour(s) of the scheduled time. late booking is ${lateCancelMinutes}`
      );
      toast.error(
        `Cannot cancel. The booking is within ${message} hour(s) of the scheduled time.`
      );
      return false;
    }

    return true;
  };

  const handleConfirmCancellation = async () => {
    const unqqId = props.reservId;
    if (!unqqId) {
      toast.error("Something went wrong");
      return;
    }

    let isValid = true;

    if (lateCancel != 0) {
      isValid = validateLateCancel();
    }

    console.log("lateCancel", isValid);
    if (isValid === false) return;

    await cancelReservation(unqqId, {
      onSuccess: async (res) => {
        if (res && res.error == true) {
          let message = res.errorMessage ?? "Cancellation failed!";
          toast.error(message);
          return;
        }
        props.setShowModal(false);
        if (props.reservStringId) {
          await getReservationDetails(props.reservStringId);
        }
        toast.success("Your reservation is cancelled successfully!");
      },
      onFailed: (err) => {
        let message =
          err.response.data.errorMessage.message ?? "Cancellation failed!";
        toast.error(message);
      },
    });
  };

  return (
    <Fragment>
      <div
        className={
          props.showModal
            ? "modal_wrapper_02901 animate__animated animate__fadeIn"
            : "modal_wrapper_02901 hide animate__animated animate__fadeIn"
        }
        id="modal_wrapper_02901"
      >
        <div className="moadl_02901 animate__animated p-4" ref={modalRef}>
          <button
            className="close_02901"
            onClick={async () => {
              props.setShowModal(false);
            }}
            style={{ color: "#252525" }}
          >
            <Io5.IoCloseCircle />
          </button>
          {reservAction == "cancel" ? (
            <Fragment>
              <h5>Confirm Reservation Cancellation</h5>
              <p>
                Are you sure you want to cancel the reservation? This action
                cannot be undone.
              </p>
              <div className="btn_grp mt-4">
                <button
                  type="button"
                  className="reserv_modal_btn confirm_cancel"
                  onClick={handleConfirmCancellation}
                  disabled={reservationLoading}
                >
                  {reservationLoading === false ? (
                    "Confirm"
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
                <button
                  type="button"
                  className="reserv_modal_btn discard_btn_reserv"
                  onClick={async () => {
                    props.setShowModal(false);
                  }}
                >
                  Disacrd
                </button>
              </div>
            </Fragment>
          ) : reservAction == "mail" ? (
            <Fragment>
              <h5>Send mail to the shop</h5>
              <form>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="" className="form-label">
                        From
                      </label>
                      <input
                        type="text"
                        name=""
                        id=""
                        className="form-control mx-0 mb-3"
                        value={props?.email}
                        disabled
                      />
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="" className="form-label">
                        To
                      </label>
                      <input
                        type="text"
                        name=""
                        id=""
                        className="form-control mx-0 mb-3"
                        value={props?.email}
                        disabled
                      />
                    </div>
                  </div> */}
                </div>
                <textarea
                  name=""
                  id=""
                  rows={10}
                  className="mail_content_reserv"
                />
                <button type="submit" className="resrv_btnn" id="send_mail_btn">
                  <i className="pe-2">
                    <Gr.GrSend />
                  </i>
                  Send
                </button>
              </form>
            </Fragment>
          ) : (
            ""
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default ReservModal;
