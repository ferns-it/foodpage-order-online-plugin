import { Fragment } from "react";
import { FadeLoader } from "react-spinners";
import Lottie from "react-lottie";
import animationData from "../assets/loaderrr.json";
import "../style/order-online-style.css";

function LoaderComp() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Fragment>
      <div className="loader-wrapper">
        <div className="loader__">
          <Lottie options={defaultOptions} />
          {/* <FadeLoader size={50} color="#e61a16" /> */}
        </div>
      </div>
    </Fragment>
  );
}

export default LoaderComp;
