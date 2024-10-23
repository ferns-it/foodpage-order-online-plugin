import React, { Fragment, useContext, useEffect, useState } from "react";
import { TableReservationContext } from "../context/TableReservationContext";
import "../style/style.css";
import Utils from "../../_utils/Utils";

import * as Tb from "react-icons/tb";
import * as Md from "react-icons/md";
import ReservModal from "../components/ReservModal";

function ViewReservation({ reservId, uniqId }) {
  const { reservationDetails, getReservationDetails, reservationLoading } =
    useContext(TableReservationContext);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [updatedValues, setUpdatedValue] = useState({
    bookingDate: "",
    bookingTime: "",
    name: "",
    email: "",
    phone: "",
    chairs: "",
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!reservId) return;
    const fetchData = async () => {
      if (!reservationDetails) {
        await getReservationDetails(reservId);
      }
      setUpdatedValue(reservationDetails);
    };

    console.log(reservationDetails);
    

    const today = new Date();
    const bookingDate = reservationDetails?.bookingTime
      ? new Date(reservationDetails?.bookingTime)
      : null;

    if (bookingDate) return;

    console.log(bookingDate, "date=>");

    fetchData();
  }, [reservId, reservationDetails]);

  function handleCancelConfirm() {
    setShowModal(true);
  }

  return (
    <Fragment>
      <ReservModal
        showModal={showModal}
        setShowModal={setShowModal}
        action="cancel"
        reservId={uniqId}
      />
      <section className="tbl_reserv_section">
        <div className="container">
          <div className="card manage_reserv_card">
            <h3 className="table-reservation-form-head">Reservation Details</h3>
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
            <p className="formatted_id">
              {reservationDetails?.formattedID ?? "N/A"}
            </p>
            <table className="table reserv_table mt-2">
              <tbody>
                <tr>
                  <td className="reserv_table_sub_head">Booking Date</td>
                  <td className="reser_table_value">
                    {!isEdit ? (
                      <>
                        {reservationDetails?.bookingTime
                          ? Utils.formatDate(reservationDetails?.bookingTime)
                          : "N/A"}
                      </>
                    ) : (
                      <>
                        {" "}
                        <input
                          type="date"
                          name="bookingTime"
                          id=""
                          className="form-control table_reserv_form_input"
                          defaultValue={updatedValues?.bookingTime}
                        />
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="reserv_table_sub_head">Booking Time</td>
                  <td className="reser_table_value">
                    {!isEdit ? (
                      <>
                        {reservationDetails?.bookingTime
                          ? Utils.convertTiming(reservationDetails?.bookingTime)
                          : "N/A"}
                      </>
                    ) : (
                      <>
                        {" "}
                        <input
                          type="time"
                          name="bookingDate"
                          id=""
                          className="form-control table_reserv_form_input"
                          value={updatedValues?.bookingTime}
                        />
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="reserv_table_sub_head">Booked By</td>
                  <td className="reser_table_value">
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
                        />
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="reserv_table_sub_head">Email Address</td>
                  <td className="reser_table_value">
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
                        />
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="reserv_table_sub_head">Phone Number</td>
                  <td className="reser_table_value">
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
                        />
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="reserv_table_sub_head">Chairs</td>
                  <td className="reser_table_value">
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
                        />
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="reserv_table_sub_head">Advance Amount</td>
                  <td className="reser_table_value">
                    {reservationDetails?.advanceAmount ?? "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
            {!isEdit ? (
              <div className="btn_grp">
                <button type="button" className="resrv_btnn mail_reserv">
                  <i className="pe-2">
                    <Tb.TbMailStar />
                  </i>
                  Mail to Restaurent
                </button>
                <button
                  type="button"
                  className="resrv_btnn cancel_reserv"
                  onClick={handleCancelConfirm}
                  disabled={reservationLoading}
                >
                  <i className="pe-2">
                    <Tb.TbCalendarCancel />
                  </i>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="resrv_btnn cancel_reserv mt-2"
                onClick={handleCancelConfirm}
                style={{ width: "30%", margin: "0 auto" }}
              >
                <i className="pe-2">
                  <Tb.TbPencilDown />
                </i>
                Update
              </button>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default ViewReservation;
