import React, { Fragment, useEffect, useState } from "react";
import * as Io5 from "react-icons/io5";
import * as Bs from "react-icons/bs";

function AddOnsModal(props) {
  const [count, setCount] = useState(0);
  const [variationValue, setVariationValue] = useState("");
  useEffect(() => {
    // if (!props.showModal) return;
    if (props.showModal == false) {
      setCount(0);
      setVariationValue("");
    }

    const modalElement = document.querySelector(".moadl_02901");
    if(!modalElement) return;
    if (props.openModal) {
      modalElement.classList.add("animate__backOutDown");
    } else {
      modalElement.classList.remove("animate__backInDown");
    }
  }, [props.showModal]);

  if (!props.showModal || !props.productData) return;

  const foodValues = props.productData;

  const handleDecrement = () => {
    if (count === 0) return;
    setCount(count - 1);
  };

  return (
    <Fragment>
      <div
        className={
          props.showModal
            ? "modal_wrapper_02901 animate__animated animate__fadeIn"
            : "modal_wrapper_02901 hide animate__animated animate__fadeIn"
        }
        id="modal_wrapper_02901"
      >
        <div className="moadl_02901 animate__animated animate__backInDown">
          <div className="product_img_bg_029">
            <img src={foodValues && foodValues?.photo} alt="" />
          </div>

          <button
            className="close_02901"
            onClick={() => props.setShowModal(false)}
          >
            <Io5.IoCloseCircle />
          </button>
          <div className="container content_container_02901">
            <h2 className="food_name_02901">{foodValues?.name ?? "N/A"}</h2>
            <p className="food_desc_02901">
              {foodValues?.description ?? "N/A"}
            </p>
            <p className="price_02901">{foodValues?.price ?? "N/A"}</p>
            <div className="inc_dec_wrapper_0291">
              <div className="incDec_wrapper_0291">
                <input type="checkbox" id="toggle" class="toggle-checkbox" />
                <div class="counter-container">
                  <label
                    for="toggle"
                    class="decrement-button"
                    onClick={handleDecrement}
                  >
                    -
                  </label>
                  <span class="counter-text">{count}</span>
                  <label
                    for="toggle"
                    class="increment-button red"
                    onClick={() => setCount(count + 1)}
                  >
                    +
                  </label>
                </div>
              </div>
            </div>

            <p className="sub_head_0291">Choose One</p>
            <table className="menu_table_0291">
              {foodValues &&
                foodValues.variations &&
                foodValues?.variations.length != 0 &&
                foodValues.variations.map((varient, index) => {
                  return (
                    <tr key={index}>
                      <td className="d-flex">
                        <label
                          // htmlFor={varient?.name}
                          className="delivery_option_container"
                        >
                          <input
                            type="radio"
                            name="variationOption"
                            id="variations"
                            className="delivery_option"
                            checked={variationValue == varient?.name}
                            onClick={() => {
                              setVariationValue(varient?.name);
                            }}
                          />
                          <span class="checkmark"></span>
                          <span className="varient_name">
                            {varient?.name ?? "N/A"}
                          </span>
                        </label>
                      </td>
                      <td>{varient?.displayPrice ?? "N/A"}</td>
                    </tr>
                  );
                })}
            </table>
            {foodValues.addons && foodValues.addons.length != 0 && <hr />}
            {foodValues.addons &&
              foodValues.addons.length != 0 &&
              foodValues.addons.map((item, index) => {
                return (
                  <Fragment>
                    <p className="sub_head_0291" key={index}>
                      {item?.name ?? "N/A"}
                    </p>
                    <table className="menu_table_0291">
                      {item?.options &&
                        item?.options.map((data, index) => {
                          return (
                            <tr>
                              <td className="d-flex">
                                <label
                                  // htmlFor={varient?.name}
                                  className="delivery_option_container"
                                >
                                  <input
                                    type="checkbox"
                                    name="addOns"
                                    id="variations"
                                    className="delivery_option"
                                  />
                                  <span class="checkmark"></span>
                                  <span className="varient_name">
                                    {data?.text ?? "N/A"}
                                  </span>
                                </label>
                              </td>
                              <td>+ {data?.price_formatted ?? "N/A"}</td>
                            </tr>
                          );
                        })}
                    </table>
                  </Fragment>
                );
              })}
            {foodValues?.masterAddons &&
              foodValues?.masterAddons.length != 0 && <hr />}
            {foodValues?.masterAddons &&
              foodValues?.masterAddons.length != 0 &&
              foodValues?.masterAddons.map((item, index) => {
                return (
                  <Fragment>
                    <p className="sub_head_0291" key={index}>
                      {item?.name ?? "N/A"}
                    </p>
                    <table className="menu_table_0291">
                      {item?.options &&
                        item?.options.map((data, index) => {
                          return (
                            <tr>
                              <td className="d-flex">
                                <label
                                  // htmlFor={varient?.name}
                                  className="delivery_option_container"
                                >
                                  <input
                                    type="checkbox"
                                    name="addOns"
                                    id="variations"
                                    className="delivery_option"
                                  />
                                  <span class="checkmark"></span>
                                  <span className="varient_name">
                                    {data?.text ?? "N/A"}
                                  </span>
                                </label>
                              </td>
                              <td>+ {data?.price_formatted ?? "N/A"}</td>
                            </tr>
                          );
                        })}
                    </table>
                  </Fragment>
                );
              })}
            <br />
            <div className="btn_grp_8392">
              <button type="button" className="submit_btn_8392 btn_8392">
                <i>
                  <Bs.BsCart3 />
                </i>
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                className="cancel_btn_8392 btn_8392"
                onClick={() => props.setShowModal(false)}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AddOnsModal;
