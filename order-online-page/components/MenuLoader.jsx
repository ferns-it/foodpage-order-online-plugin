import { Fragment } from "react";
import { FadeLoader } from "react-spinners";
import Lottie from "react-lottie";
import animationData from "../assets/loaderrr.json";

function MenuLoader() {
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
      <div
        className="loader-wrapper"
        style={{ position: "relative", minHeight: "500px", height: "100%" }}
      >
        <div
          className="loader__"
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transition: "translate(-50%, -50%)",
          }}
        >
          <Lottie options={defaultOptions} />
          {/* <FadeLoader size={50} color="#e61a16" /> */}
        </div>
      </div>
    </Fragment>
  );
}

export default MenuLoader;
