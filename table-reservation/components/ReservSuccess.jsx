import Image from "next/image";
import React, { Fragment } from "react";
// import { useRouter } from "next/navigation";

function ReservSuccess() {
  // const router = useRouter();
  const gobackhome =()=>{
    window.location.href="/"
  }
  return (
    <Fragment>
      <div className="container mt-5 mb-5">
       
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
          onClick={gobackhome}
        >
          Go Home
        </button>
      </div>
    </Fragment>
  );
}

export default ReservSuccess;
