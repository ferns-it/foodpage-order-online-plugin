import React, { Fragment, useContext, useEffect, useState } from "react";
import { TableReservationContext } from "../context/TableReservationContext";
import "../style/style.css";
import Utils from "../../_utils/Utils";

import * as Tb from "react-icons/tb";
import * as Md from "react-icons/md";
import * as Go from "react-icons/go";
import ReservModal from "../components/ReservModal";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

function ViewReservation({ reservId }) {
  const router = useRouter();
  const {
    reservationDetails,
    getReservationDetails,
    reservationLoading,
    updateReservationDetails,
  } = useContext(TableReservationContext);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [updatedValues, setUpdatedValue] = useState({
    bookingDate: "",
    bookingTime: "",
    name: "",
    email: "",
    phone: "",
    chairs: "",
    message: "",
  });
  const [isExpired, setIsExpired] = useState(false);
  const [action, setAction] = useState("");

  useEffect(() => {
    if (!reservId) return;
    const fetchData = async () => {
      if (!reservationDetails) {
        await getReservationDetails(reservId);
      }
    };

    fetchData();
    if (reservationDetails) {
      const [date, time] = (reservationDetails?.bookingTime).split(" ");
      setUpdatedValue({
        name: reservationDetails?.name,
        email: reservationDetails?.email,
        phone: reservationDetails?.phone,
        chairs: reservationDetails?.chairs,
        bookingDate: date,
        bookingTime: time,
        message: reservationDetails?.message,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate =
      reservationDetails && new Date(reservationDetails.bookingTime);
    if (bookingDate) {
      bookingDate.setHours(0, 0, 0, 0);
    }

    if (bookingDate && bookingDate < today) {
      setIsExpired(true);
    }
  }, [reservId, reservationDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdatedValue((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const errors = {};

    if (!updatedValues.bookingDate)
      errors.bookingDate = "Booking date is required";
    if (!updatedValues.bookingTime)
      errors.bookingTime = "Booking time is required";
    if (!updatedValues.name) errors.name = "Name is required";
    if (!updatedValues.email) errors.email = "Email is required";
    if (!updatedValues.phone) errors.phone = "Phone number is required";
    if (!updatedValues.chairs) errors.chairs = "Number of chairs is required";

    return errors;
  };

  function handleCancelConfirm() {
    setShowModal(true);
    setAction("cancel");
  }

  const handleSendMail = () => {
    setShowModal(true);
    setAction("mail");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const isValid = validateFields();
    if (Object.keys(isValid) && Object.keys(isValid).length != 0) {
      const value = Object.values(isValid)[0];
      toast.error(value);
      return;
    }

    const mergedBooking = mergeBookingDateTime(
      updatedValues?.bookingDate,
      updatedValues?.bookingTime
    );
    const unqqId = CryptoJS.MD5(reservationDetails?.id).toString();
    const payload = {
      uniqId: unqqId,
      shopID: process.env.SHOP_ID,
      name: updatedValues?.name,
      phone: updatedValues?.phone,
      email: updatedValues?.email,
      totalChair: updatedValues?.chairs,
      reservationDateTime: mergedBooking,
      advancePayment: "No",
      advanceAmount: "",
      paymentMethod: "",
      transactionID: "",
      message: updatedValues?.message,
      baseUrl: process.env.TABLE_RESERVATION_URL,
      source: "NextJs",
    };

    await updateReservationDetails(payload, {
      onSuccess: async (res) => {
        if (res && res.error == true) {
          const msg = res?.errorMessage ?? "Updation failed, Please try again!";
          toast.error(msg);
          return;
        }
        toast.success("Details are successfully updated!");
        await getReservationDetails(reservId);
        setIsEdit(false);
      },
      onFailed: (err) => {
        const msg =
          err?.response?.data?.errorMessage?.message ??
          "Updation failed, Please try again!";
        toast.error(msg);
        console.log("updating error", err);
      },
    });
  };

  return (
    <Fragment>
      <ReservModal
        showModal={showModal}
        setShowModal={setShowModal}
        action={action}
        // reservId={uniqId}
        email={reservationDetails?.email}
        reservStringId = {reservId}
      />
      <section className="tbl_reserv_section">
        <div className="container mt-4">
          <button
            className="go_back mx-5"
            onClick={() => router.push("/manage-reservation")}
          >
            <Go.GoArrowLeft /> Back
          </button>
          <div className="card manage_reserv_card">
            <h3 className="table-reservation-form-head head_edit">Reservation Details</h3>
            {isExpired == false &&
              reservationDetails?.status !== "Cancelled" &&
              reservationDetails?.status !== "Modified" && (
                <button
                  type="button"
                  className="resrv_btnn update_reserv"
                  onClick={() => setIsEdit(!isEdit)}
                >
                  {!isEdit ? (
                    <>
                      <i className="pe-2">
                        <Tb.TbPencilDown />
                      </i>
                      Edit
                    </>
                  ) : (
                    <>
                      <i className="pe-2">
                        <Md.MdClose />
                      </i>
                      Close
                    </>
                  )}
                </button>
              )}
            <p className="formatted_id">
              {reservationDetails?.formattedID ?? "N/A"}
            </p>
            <form>
              <table className="table reserv_table mt-2">
                <tbody>
                  <tr>
                    <td className="reserv_table_sub_head">Booking Date</td>
                    <td className="reser_table_value">
                      {!reservationLoading ? (
                        <Fragment>
                          {!isEdit ? (
                            <>
                              {reservationDetails?.bookingTime
                                ? Utils.formatDate(
                                    reservationDetails?.bookingTime
                                  )
                                : "N/A"}
                            </>
                          ) : (
                            <>
                              {" "}
                              <input
                                type="date"
                                name="bookingDate"
                                id=""
                                className="form-control table_reserv_form_input"
                                value={updatedValues?.bookingDate}
                                onChange={handleChange}
                              />
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Skeleton height={20} width={150} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="reserv_table_sub_head">Booking Time</td>
                    <td className="reser_table_value">
                      {!reservationLoading ? (
                        <Fragment>
                          {!isEdit ? (
                            <>
                              {reservationDetails?.bookingTime
                                ? Utils.formatDateTime(
                                    reservationDetails?.bookingTime
                                  )
                                : "N/A"}
                            </>
                          ) : (
                            <>
                              {" "}
                              <input
                                type="time"
                                name="bookingTime"
                                id=""
                                className="form-control table_reserv_form_input"
                                value={updatedValues?.bookingTime}
                                onChange={handleChange}
                              />
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Skeleton height={20} width={150} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="reserv_table_sub_head">Booked By</td>
                    <td className="reser_table_value">
                      {!reservationLoading ? (
                        <Fragment>
                          {!isEdit ? (
                            <>{reservationDetails?.name ?? "N/A"}</>
                          ) : (
                            <>
                              {" "}
                              <input
                                type="text"
                                name="name"
                                id=""
                                className="form-control table_reserv_form_input"
                                value={updatedValues?.name}
                                onChange={handleChange}
                              />
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Skeleton height={20} width={150} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="reserv_table_sub_head">Email Address</td>
                    <td className="reser_table_value">
                      {!reservationLoading ? (
                        <Fragment>
                          {!isEdit ? (
                            <>{reservationDetails?.email ?? "N/A"}</>
                          ) : (
                            <>
                              {" "}
                              <input
                                type="text"
                                name="email"
                                id=""
                                className="form-control table_reserv_form_input"
                                value={updatedValues?.email}
                                onChange={handleChange}
                              />
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Skeleton height={20} width={150} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="reserv_table_sub_head">Phone Number</td>
                    <td className="reser_table_value">
                      {!reservationLoading ? (
                        <Fragment>
                          {!isEdit ? (
                            <>{reservationDetails?.phone ?? "N/A"}</>
                          ) : (
                            <>
                              {" "}
                              <input
                                type="text"
                                name="phone"
                                id=""
                                className="form-control table_reserv_form_input"
                                value={updatedValues?.phone}
                                onChange={handleChange}
                              />
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Skeleton height={20} width={150} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="reserv_table_sub_head">Chairs</td>
                    <td className="reser_table_value">
                      {!reservationLoading ? (
                        <Fragment>
                          {!isEdit ? (
                            <>{reservationDetails?.chairs ?? "N/A"}</>
                          ) : (
                            <>
                              {" "}
                              <input
                                type="number"
                                name="chairs"
                                id=""
                                className="form-control table_reserv_form_input"
                                value={updatedValues?.chairs}
                                max={25}
                                onChange={handleChange}
                              />
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Skeleton height={20} width={150} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="reserv_table_sub_head">Message</td>
                    <td className="reser_table_value">
                      {!reservationLoading ? (
                        <Fragment>
                          {!isEdit ? (
                            <>{reservationDetails?.message ?? "N/A"}</>
                          ) : (
                            <>
                              {" "}
                              <textarea
                                type="text"
                                name="message"
                                id=""
                                className="form-control table_reserv_form_input"
                                value={updatedValues?.message}
                                onChange={handleChange}
                                rows={3}
                              />
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Skeleton height={20} width={150} />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="reserv_table_sub_head">
                      Reservation Status
                    </td>
                    <td className="reser_table_value">
                      {!reservationLoading ? (
                        <Fragment>
                          {reservationDetails?.status ?? "N/A"}
                        </Fragment>
                      ) : (
                        <Skeleton height={20} width={100} />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>

            {isExpired === false &&
            reservationDetails?.status != "Cancelled" ? (
              <Fragment>
                {!isEdit ? (
                  <div className="btn_grp">
                    {/* <button
                      type="button"
                      className="resrv_btnn mail_reserv"
                      onClick={handleSendMail}
                    >
                      <i className="pe-2">
                        <Tb.TbMailStar />
                      </i>
                      Mail to Restaurent
                    </button> */}
                    <button
                      type="button"
                      className="resrv_btnn cancel_reserv"
                      onClick={handleCancelConfirm}
                      disabled={reservationLoading}
                    >
                      <i className="pe-2">
                        <Tb.TbCalendarCancel />
                      </i>
                      Cancel Reservation
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="resrv_btnn cancel_reserv mt-2"
                    onClick={handleUpdate}
                    style={{ width: "30%", margin: "0 auto" }}
                    disabled={reservationLoading}
                  >
                    {!reservationLoading ? (
                      <>
                        {" "}
                        <i className="pe-2">
                          <Tb.TbPencilDown />
                        </i>
                        Update
                      </>
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
                )}
              </Fragment>
            ) : (
              <Fragment>
                <p className="expiry_reserv">{`This reservation is ${
                  reservationDetails?.status == "Cancelled"
                    ? "Cancelled"
                    : "Expired"
                }!`}</p>
              </Fragment>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default ViewReservation;
