import { Fragment } from "react";
import { FadeLoader } from "react-spinners";

function LoaderComp() {
  return (
    <Fragment>
      <div className="loader-wrapper">
        <div className="loader__">
          <FadeLoader size={50} color="#e61a16" />
        </div>
      </div>
    </Fragment>
  );
}

export default LoaderComp;
