import React, { Fragment } from "react";

function PleaseWait() {
  return (
    <Fragment>
      <div className="loading____">
        <p>Please wait</p>
        <span>
          <i></i>
          <i></i>
        </span>
      </div>
    </Fragment>
  );
}

export default PleaseWait;
