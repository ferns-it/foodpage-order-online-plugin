import React, { Fragment, useContext, useEffect, useState } from "react";
import { TableReservationContext } from "../context/TableReservationContext";

function ViewReservation(reservId) {
  const { reservationDetails } = useContext(TableReservationContext);

  useEffect(() => {
    if (!searchParams) return;
    const id = searchParams.get("reserv"); //! changes here id from parent

    if (!id) return;
    // const reservId = atob(id);

    console.log(reservId, "reservid");
  }, [searchParams]);
  console.log(reservationDetails, "reservv");

  return (
    <Fragment>
      <section className="tbl_reserv_section">
        <div className="container">
          <div className="card manage_reserv_card">
            <h3 className="table-reservation-form-head">Reservation Details</h3>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default ViewReservation;
