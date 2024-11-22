"use client";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TableReservationContext } from "../context/TableReservationContext";
import "../style/style.css";
import Utils from "../utils/Utils";

import * as Tb from "react-icons/tb";
import * as Md from "react-icons/md";
import * as Go from "react-icons/go";
import * as Fi from "react-icons/fi";
import * as Io from "react-icons/io";

import ReservModal from "../components/ReservModal";
import { useRouter, useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../style/Style.css";

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

function ViewReservation() {
  const searchParams = useSearchParams();
  const reservId = searchParams.get("reserv");

  const router = useRouter();
  const {
    reservationDetails,
    getReservationDetails,
    reservationLoading,
    updateReservationDetails,
    chatMessages,
    sendMessage,
    messageLoading,
  } = useContext(TableReservationContext);
  const chatContainerRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [updatedValues, setUpdatedValue] = useState({
    bookingDate: "",
    bookingTime: "",
    name: "",
    email: "",
    phone: "",
    chairs: 1,
    message: "",
  });
  const [isExpired, setIsExpired] = useState(false);
  const [action, setAction] = useState("");
  const [isToday, setIsToday] = useState(false);
  const [message, setMessage] = useState("");

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
  }, [reservId, reservationDetails]);

  useEffect(() => {
    if (!reservationDetails) return;
    checkIsExpired();

    const [date, time] = reservationDetails && reservationDetails?.bookingTime;
    const today = new Date().getDate();
    const bookingDate = new Date(reservationDetails?.bookingTime).getDate();

    if (bookingDate === today) {
      setIsToday(true);
    }
  }, [reservationDetails]);

  const checkIsExpired = () => {
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdatedValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleChairChange = (value) => {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9+\-*/]/g, "");
    setUpdatedValue((prev) => ({ ...prev, chairs: sanitizedValue }));
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

  const isBookingValid = () => {
    const bookingDate = updatedValues?.bookingDate;
    const bookingTime = updatedValues?.bookingTime;
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    const isValid = validateFields();

    const isValidBookingTIme = isBookingValid();

    //! condition for current UK time
    if (isValidBookingTIme === true) {
      toast.error(`Please select a time at least 4 hours from now!`);
      return;
    }

    if (Object.keys(isValid) && Object.keys(isValid).length != 0) {
      const value = Object.values(isValid)[0];
      toast.error(value);
      return;
    }

    if (updatedValues.chairs <= 0) {
      toast.error("Invalid chair selection");
      return;
    }

    const mergedBooking = mergeBookingDateTime(
      updatedValues?.bookingDate,
      updatedValues?.bookingTime
    );
    // const unqqId = CryptoJS.MD5(reservationDetails?.id).toString();
    const payload = {
      uniqId: reservId,
      totalChair: updatedValues?.chairs,
      reservationDateTime: mergedBooking,
      message: updatedValues?.message,
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
      },
    });
  };

  const sendMessageToShop = async (e) => {
    e.preventDefault();

    if (message.length === 0) {
      toast.error("Write something!");
      return;
    }

    const payload = {
      reservationId: reservationDetails?.id,
      pin: reservationDetails?.messaging_otp,
      message: message,
    };
    const headers = {
      "x-secretkey": process.env.FOODPAGE_RESERVATION_SECRET_KEY,
    };
    await sendMessage(payload, {
      onSuccess: async (res) => {
        toast.success("message sent successfully!");
        await getReservationDetails(reservId);
      },
      onFailed: (err) => {
        console.log(err);
      },
      headers: headers,
    });
  };

  const refreshPage = async () => {
    await getReservationDetails(reservId);
    scrollBottom();
  };

  const scrollBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <Fragment>
      <ReservModal
        showModal={showModal}
        setShowModal={setShowModal}
        action={action}
        reservId={reservId}
        email={reservationDetails?.email}
        reservStringId={reservId}
      />
      <section className="tbl_reserv_section">
        <div className="container">
          {/* <button
            className="go_back mb-2"
            onClick={() => router.push("/manage-reservation")}
          >
            <Go.GoArrowLeft /> Back
          </button> */}
          <div className="row">
            <div className="col-lg-8 col-md-12 col-sm-12 position-relative">
              <div className="card manage_reserv_card" id="alter_card">
                <h3 className="table-reservation-form-head">
                  Reservation Details
                </h3>
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
                              {reservationDetails?.bookingTime
                                ? Utils.formatDate(
                                    reservationDetails?.bookingTime
                                  )
                                : "N/A"}
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
                              {reservationDetails?.name ?? "N/A"}
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
                            <>{reservationDetails?.email ?? "N/A"}</>
                          ) : (
                            <Skeleton height={20} width={150} />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="reserv_table_sub_head">Phone Number</td>
                        <td className="reser_table_value">
                          {!reservationLoading ? (
                            <>{reservationDetails?.phone ?? "N/A"}</>
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
                                    onChange={(e) =>
                                      handleChairChange(e.target.value)
                                    }
                                    min={1}
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
            <div className="col-lg-4 col-md-6 col-sm-12">
              {chatMessages && chatMessages.length != 0 && (
                <div className="card manage_reserv_card">
                  <button
                    type="button"
                    className="refresh_btn"
                    onClick={refreshPage}
                  >
                    <Io.IoMdRefresh /> <span>Refresh</span>
                  </button>
                  <h3 className="table-reservation-form-head">Messages</h3>
                  <div className="message-area" ref={chatContainerRef}>
                    <div class="chat-container">
                      {chatMessages.map((message, index) => {
                        if (message?.auther == "customer") {
                          return (
                            <div class="message sender" key={index}>
                              <span>
                                {" "}
                                {!reservationLoading ? (
                                  <>{message?.message ?? "N/A"}</>
                                ) : (
                                  <Skeleton />
                                )}
                              </span>
                              <p className="text-light">
                                {!reservationLoading ? (
                                  <>{message?.addedTime ?? "N/A"}</>
                                ) : (
                                  <Skeleton width={100} />
                                )}
                              </p>
                            </div>
                          );
                        }

                        if (message?.auther == "shop") {
                          return (
                            <div class="message receiver ">
                              <span>
                                {" "}
                                {!reservationLoading ? (
                                  <>{message?.message ?? "N/A"}</>
                                ) : (
                                  <Skeleton
                                    baseColor="#459ced"
                                    highlightColor="#9fc8ed"
                                  />
                                )}
                              </span>
                              <p>
                                {!reservationLoading ? (
                                  <>{message?.addedTime ?? "N/A"}</>
                                ) : (
                                  <Skeleton
                                    width={100}
                                    baseColor="#459ced"
                                    highlightColor="#9fc8ed"
                                  />
                                )}
                              </p>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  <form
                    className="send_message_form pt-3"
                    onSubmit={sendMessageToShop}
                  >
                    <div className="searc_area d-flex">
                      <input
                        type="text"
                        name=""
                        id=""
                        className="form-control"
                        placeholder="Write Message.."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="send_message_btn"
                        disabled={messageLoading}
                      >
                        {!messageLoading ? (
                          <i>
                            <Fi.FiSend />
                          </i>
                        ) : (
                          <div
                            class="spinner-border spinner-border-sm text-danger"
                            role="status"
                          ></div>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default ViewReservation;
