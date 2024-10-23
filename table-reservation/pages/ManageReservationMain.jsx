import React, { Fragment, useContext, useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "../style/style.css";
import { TableReservationContext } from "../context/TableReservationContext";
import * as Go from "react-icons/go";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function ManageReservationMain() {
  const router = useRouter();
  const { getReservationDetails, reservationLoading, reservationDetails } =
    useContext(TableReservationContext);
  const [reservId, setReservId] = useState("");
  const [error, setError] = useState(false);

  const handleReservation = async (e) => {
    e.preventDefault();
    if (reservId.length == 0) {
      setError(true);
      return;
    }

    await getReservationDetails(reservId)
      .then((res) => {
        const idd =
          res?.id && typeof res?.id == "string" ? parseInt(res?.id) : res?.id;
        const id = btoa(idd);
        console.log(reservationDetails, "reservationDetails");

        setTimeout(() => {
          router.push(`/view-reservation?reserv=${reservId}&&unq=${id}`);
        }, 200);
      })
      .catch((err) => {
        console.log("error", err);

        toast.error("Couldn't find anything right now, Please try again!");
      });
  };

  const toolTipMsg =
    "You can find the reservation ID in the reservation confirmation email. ";
  return (
    <Fragment>
      <div className="tbl_reserv_section">
        <div className="container">
          <div className="card manage_reserv_card">
            <h3 className="table-reservation-form-head">Manage Reservation</h3>
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
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ManageReservationMain;