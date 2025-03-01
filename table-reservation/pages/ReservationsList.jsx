"use client";
import React, { useContext, useEffect, useState } from "react";
import { TableReservationContext } from "../context/TableReservationContext";

import Utils from "../utils/Utils";
import * as Fa from "react-icons/fa";
import CryptoJS from "crypto-js";
import { useRouter, useSearchParams } from "next/navigation";
import { getSessionStorageItem } from "../../_utils/ClientUtils";

import "../style/Style.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ReservationsList() {
  const router = useRouter();

  const { reservationDetails, manageReservList, setManageReservList } =
    useContext(TableReservationContext);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    try {
      setListLoading(true);

      if (!reservationDetails) {
        const reservData = getSessionStorageItem("reservData");

        if (reservData && reservData.length != 0) {
          const parsedData = JSON.parse(reservData);
          setManageReservList(parsedData);
        } else {
          console.log("No reservationList found");
        }
      } else {
        setManageReservList(reservationDetails);
      }
    } finally {
      setListLoading(false);
    }
  }, [reservationDetails]);

  const handleReservationData = (id) => {
    const parsedId = CryptoJS.MD5(id);
    router.push(`/view-reservation?reserv=${parsedId}`);
  };

  return (
    <div>
      <button
        type="button"
        className="back-btn btn"
        onClick={() => router.push('/tablereservation')}
      >
        Back to Reservation
      </button>
      <br />
      <table className="table table-bordered Montserrat-font-family text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Reserved By</th>
            <th>Booking Date</th>
            <th>Booking Time</th>
            <th>Party Size</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {!listLoading ? (
            <>
              {manageReservList &&
                manageReservList.length != 0 &&
                manageReservList.map((list, idx4) => {
                  const [date, time] = list.bookingTime.split(" ");
                  return (
                    <tr key={idx4}>
                      <td>{idx4 + 1}</td>
                      <td>{list?.name ?? "N/A"}</td>
                      <td>{date ? Utils.formatDate(date) : "N/A"}</td>
                      <td>{time ? Utils.convertTiming(time) : "N/A"}</td>
                      <td>{list?.chairs}</td>
                      <td>{list?.status ?? "N/A"}</td>
                      <td>
                        <a
                          className="text-center cursor-pointer"
                          onClick={() => handleReservationData(list.id)}
                        >
                          <Fa.FaRegEye />
                        </a>
                      </td>
                    </tr>
                  );
                })}
            </>
          ) : (
            <>
              <tr>
                <td>
                  <Skeleton width={80} height={30} />
                </td>
                <td>
                  <Skeleton width={80} height={30} />
                </td>
                <td>
                  <Skeleton width={80} height={30} />
                </td>
                <td>
                  <Skeleton width={80} height={30} />
                </td>
                <td>
                  <Skeleton width={80} height={30} />
                </td>
                <td>
                  <Skeleton width={80} height={30} />
                </td>
                <td>
                  <Skeleton width={80} height={30} />
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationsList;
