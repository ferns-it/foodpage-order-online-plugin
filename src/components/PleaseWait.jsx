import React, { Fragment } from "react";
import "../style/OrderOnlineApp.css";

function PleaseWait() {
  return (
    <Fragment>
      <div class="loading____">
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
