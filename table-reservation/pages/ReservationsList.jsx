"use client";
import React, { useContext, useEffect } from "react";
import { TableReservationContext } from "../context/TableReservationContext";
import { getSessionStorageItem } from "../../_utils/ClientUtils";
import Utils from "../utils/Utils";
import * as Fa from "react-icons/fa";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";

function ReservationsList() {
  const router = useRouter();
  const { reservationDetails, manageReservList, setManageReservList, setReservationDetails } =
    useContext(TableReservationContext);

  useEffect(() => {
    if (!reservationDetails) {
      const reservData = getSessionStorageItem("reservData");
      if (reservData && reservData.length != 0) {
        const parsedData = JSON.parse(reservData);
        setManageReservList(parsedData);
      }
    }
  }, []);

  const handleReservationData = (data) => {
    const idd = data.id;
    const parsedId = CryptoJS.MD5(idd);
    router.push(`/view-reservation?reserv=${parsedId}`);
    setReservationDetails(data)
  };

  return (
    <div>
      <div className="container table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="thead-dark">
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
            {manageReservList &&
              manageReservList.length != 0 &&
              manageReservList?.map((list, idx4) => {
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
                        onClick={() => handleReservationData(list)}
                        style={{cursor: "pointer"}}
                      >
                        <Fa.FaRegEye />
                      </a>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReservationsList;
