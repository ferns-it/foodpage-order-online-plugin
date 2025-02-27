"use client";
import React, { Fragment, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import * as Go from "react-icons/go";
import * as Fa from "react-icons/fa";
import toast from "react-hot-toast";
import "react-tooltip/dist/react-tooltip.css";
import CryptoJS from "crypto-js";
import { TableReservationContext } from "../context/TableReservationContext";

import Utils from "../utils/Utils";
import { AppContext } from "../../order-online-page/context";

function ManageReservationMain() {
  const router = useRouter();
  const {
    getReservationDetails,
    reservationLoading,
    reservationDetails,
    reservationList,
  } = useContext(TableReservationContext);
  const [reservId, setReservId] = useState("");
  const [error, setError] = useState(false);

  const handleReservation = async (reservId) => {
    await getReservationDetails(reservId)
      .then((res) => {
        const idd =
          res?.id && typeof res?.id == "string" ? parseInt(res?.id) : res?.id;
        const id = btoa(idd);

        const parsedId = CryptoJS.MD5(res?.id);

        if (res.error == true) {
          toast.error(res.message);
          return;
        }

        setTimeout(() => {
          router.push(`/view-reservation?reserv=${parsedId}`);
        }, 200);
      })
      .catch((err) => {
        toast.error("Couldn't find anything right now, Please try again!");
      });
  };

  const toolTipMsg =
    "You can find the reservation ID in the reservation confirmation email. ";

  return (
    <Fragment>
      <div className="tbl_reserv_section">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-md-12 col-sm-12">
              <h2>Reservation List</h2>
              <div class="container table-responsive">
                <table class="table table-bordered table-hover">
                  <thead class="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Reservation ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Number of chairs</th>
                      <th scope="col">Booking Date</th>
                      <th scope="col">Booking Time</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationList &&
                      Array.isArray(reservationList) &&
                      reservationList.map((data, index) => {
                        const time = data?.bookingTime.split(" ")[1];
                        return (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{data?.formattedID ?? "N/A"}</td>
                            <td>{data?.name ?? "N/A"}</td>
                            <td>{data?.chairs ?? "N/A"}</td>
                            <td>
                              {Utils.formatDate(data?.bookingTime) ?? "N/A"}
                            </td>
                            <td>{time ?? "N/A"}</td>
                            <td>{data?.status ?? "N/A"}</td>
                            <td>
                              <button
                                type="button"
                                onClick={() =>
                                  handleReservation(data.formattedID)
                                }
                                className="def-add-tab"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className="col-md-4 col-sm-12">
              <div className="card card-manage p-3 pt-3 mt-3">
                <h3 className="table-reservation-form-head">
                  Manage Reservation
                </h3>
                <form onSubmit={handleReservation}>
                  <div className="form-group">
                    <label
                      htmlFor="reserv_id"
                      className="form-label table_reserv_form_label"
                    >
                      Enter your reservation ID
                    </label>
                    <input
                      type="text"
                      name=""
                      id="reserv_id"
                      className={
                        "form-control table_reserv_form_input p-3 " +
                        (error && reservId.length === 0 ? "err__" : "")
                      }
                      value={reservId}
                      onChange={(e) => setReservId(e.target.value)}
                      autoComplete="off"
                    />
                    {error && reservId.length == 0 && (
                      <span className="reserv_from_err">
                        Select a valid Reservation ID!
                      </span>
                    )}
                  </div>

                  <Tooltip id="info_tooltip" />
                  <a
                    data-tooltip-id="info_tooltip"
                    data-tooltip-content={toolTipMsg}
                    className="reservId_find"
                    data-tooltip-place="right"
                  >
                    Where can I find my reservation ID?
                  </a>

                  <button
                    type="submit"
                    className="submit_reserv_btn mt-3"
                    disabled={reservationLoading}
                  >
                    {reservationLoading === false ? (
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
                    )}
                  </button>
                </form>
                <br />
                <p className="reservId_response_info">
                  <i>
                    <Fa.FaInfoCircle />
                  </i>
                  {toolTipMsg}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ManageReservationMain;
