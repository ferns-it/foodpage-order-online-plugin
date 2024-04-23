import React, { Fragment } from "react";
import * as Io5 from "react-icons/io5";

function AddOnsModal(props) {
  if (!props.showModal || !props.productData) return;
  const foodValues = props.productData;

  return (
    <Fragment>
      <div
        className={
          props.showModal
            ? "modal_wrapper_02901 animate__animated animate__fadeIn"
            : "modal_wrapper_02901 hide animate__animated animate__fadeIn"
        }
      >
        <div className="moadl_02901">
          <button
            className="close_02901"
            onClick={() => props.setShowModal(false)}
          >
            <Io5.IoCloseCircle />
          </button>
          <div className="container">
            <h2 className="food_name_02901">{foodValues?.name ?? "N/A"}</h2>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AddOnsModal;
