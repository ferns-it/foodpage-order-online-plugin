import Image from "next/image";
import React, { Fragment } from "react";
import Success from "../assets/success.png";
import { useRouter } from "next/navigation";

function ReservSuccess() {
  const router = useRouter();
  return (
    <Fragment>
      <div className="container mt-5 mb-5">
        <div className="reser_success_">
          <Image src={Success} alt="Success image" />
          {/* <img src={require("../assets/success.png")} /> */}
        </div>
        <div className="reserv_content_success__">
          <h1> Congratulations! 🎉</h1>
          <p>
            Your table reservation request has been successfully sent. Our team
            is on it, and we'll be in touch with the results shortly. Thank you
            for choosing us, and we look forward to serving you soon!
          </p>
        </div>
        <br />
        <button
          className="reserv_success-btn-29"
          onClick={() => router.push("/")}
        >
          Go Home
        </button>
      </div>
    </Fragment>
  );
}

export default ReservSuccess;
