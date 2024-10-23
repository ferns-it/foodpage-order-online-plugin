import React, { Fragment, useContext, useEffect, useRef } from "react";
import * as Io5 from "react-icons/io5";
import "../style/style.css";
import "../../order-online-page/style/order-online-style.css"; //? style from order online
import CryptoJS from "crypto-js";
import { TableReservationContext } from "../context/TableReservationContext";
import toast from "react-hot-toast";

function ReservModal(props) {
  const modalRef = useRef(null);
  const { cancelReservation, reservationLoading } = useContext(
    TableReservationContext
  );

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

  const handleConfirmCancellation = async () => {
    const unqqId = CryptoJS.MD5(props.reservId.toString()).toString();
    if (!unqqId) {
      toast.error("Something went wrong");
      return;
    }

    await cancelReservation(unqqId, {
      onSucces: (res) => {
        console.log("respp", res);

        if (res && res.error == true) {
          let message = res.errorMessage ?? "Cancellation failed!";
          toast.error(message);
          return;
        }
        toast.success("Your reservation is cancelled successfully!");
      },
      onFailed: (err) => {
        let message =
          err.response.data.errorMessage.message ?? "Cancellation failed!";
        toast.error(message);
        console.log("Cancellation error", err);
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
          <h5>Confirm Reservation Cancellation</h5>
          <p>
            Are you sure you want to cancel the reservation? This action cannot
            be undone.
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
        </div>
      </div>
    </Fragment>
  );
}

export default ReservModal;
