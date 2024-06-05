import React, { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaRegCircleCheck } from "react-icons/fa6";

function Success() {
  //   const navigate = useNavigate();
  const { orderDetails } = useContext(AppContext);

  const data = orderDetails?.data?.data;
  return (
    <Fragment>
      <div className="container">
        <div className="reser_success_">
          <img src={require("../assets/success.png")} alt="" />
        </div>
        <div className="reserv_content_success__">
          <h1> Congratulations! 🎉</h1>
          <p>{data}</p>
        </div>
        <button
          className="reserv_success-btn-29"
          onClick={() => (window.location.href = "/")}
        >
          Go Home
        </button>
      </div>
    </Fragment>
  );
}

export default Success;
