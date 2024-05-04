import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Io5 from "react-icons/io5";
import * as Bs from "react-icons/bs";
import Utils from "../utils/Utils";
import toast, { Toaster } from "react-hot-toast";
import { AppContext } from "../context/AppContext";

function AddOnsModal(props) {
  const modalRef = useRef(null);
  const { addToCart, fetchCartList, cartLoading } = useContext(AppContext);
  const [count, setCount] = useState(1);
  const [variationValue, setVariationValue] = useState({
    name: "",
    pvID: "",
    price: 0,
  });
  const [addOns, setAddOns] = useState({});
  const [masterAddons, setMasterAddons] = useState({});

  const foodValues = props.productData;

  const emptyStates = () => {
    setCount(1);
    setVariationValue("");
    setAddOns({});
    setMasterAddons({});
  };

  useEffect(() => {
    // if (!props.showModal) return;
    if (props.showModal == false) {
      emptyStates();
    }
  }, [props.showModal]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      props.setShowModal(false);
    }
  };

  const handleEscKeyPress = (event) => {
    if (event.keyCode === 27) {
      props.setShowModal(false);
    }
  };

  useEffect(() => {
    if (props.showModal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKeyPress);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKeyPress);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [props.showModal]);

  if (!props.showModal || !props.productData) return;

  const handleDecrement = () => {
    if (count === 1) return;
    setCount(count - 1);
  };

  const total = variationValue && variationValue?.price * count;

  const handleMinAddons = (data) => {
    if (!data) return;

    const addData = data.map((item) => {
      const filteredOptions = item.options.filter(
        (option) =>
          masterAddons &&
          masterAddons[item.id] &&
          masterAddons[item.id].includes(option.itemId)
      );
      return {
        ...item,
        options: filteredOptions,
      };
    });
    return addData;
  };

  const handleCart = async () => {
    let userId = "";
    userId = localStorage.getItem("user");
    if (!userId) {
      userId = Utils.generateRandomId();
      localStorage.setItem("user", userId);
    }

    if (count <= 0) {
      toast.error("Least quantity is 1");
      return;
    }
    if (
      !variationValue ||
      variationValue.name.length === 0 ||
      variationValue.pvID.length === 0
    ) {
      toast.error("Variations are required, Please choose one!");
      return;
    }

    const masterAddOnsData = foodValues?.masterAddons;
    const addOnsData  =handleMinAddons(masterAddOnsData);
    // console.log(addOns);
    // console.log(masterAddons);
    return;
    let cOptionObj = {
      pvID: variationValue?.pvID,
      addons: addOns,
      masterAddons: masterAddons,
    };
    const payload = {
      qty: count,
      rID: props.shopId,
      pID: foodValues?.pID,
      cOption: JSON.stringify(cOptionObj),
    };

    await addToCart(payload, {
      onSuccess: async (res) => {
        console.info(res);
        toast.success("Item Added to cart!");
        await fetchCartList();

        setTimeout(() => {
          props.setShowModal(false);
        }, 1000);
      },
      onFailed: (err) => {
        console.error(err);
        toast.error("Add to cart Failed!");
      },
    });
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
        <div className="moadl_02901 animate__animated" ref={modalRef}>
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
              {foodValues?.description &&
                Utils.removeSpecialCharacters(foodValues?.description)}
            </p>
            <p className="price_02901">
              £{total && total.length != 0 ? total : 0}
            </p>
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
            <div className="row">
              <div className="col">
                <p className="sub_head_0291">Choose One</p>
                <table className="menu_table_0291">
                  {foodValues &&
                    foodValues.variations &&
                    foodValues?.variations.length != 0 &&
                    foodValues.variations.map((varient, index) => {
                      const variationName = varient?.name ?? "N/A";
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
                                checked={variationValue.name === variationName}
                                onClick={() => {
                                  setVariationValue({
                                    name: varient?.name ?? "N/A",
                                    pvID: varient?.pvID,
                                    price: varient?.price,
                                  });
                                }}
                              />
                              <span class="checkmark"></span>
                              <span className="varient_name">
                                {varient?.name ?? "N/A"}
                              </span>
                            </label>
                          </td>
                          <td style={{ userSelect: "none" }}>
                            {varient?.displayPrice ?? "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                </table>
              </div>

              {/* {foodValues.addons && foodValues.addons.length != 0 && <hr />} */}
              {foodValues.addons &&
                foodValues.addons.length != 0 &&
                foodValues.addons.map((item, index) => {
                  return (
                    <Fragment>
                      <div className="col-auto">
                        <p className="sub_head_0291" key={index}>
                          {item?.name ?? "N/A"}{" "}
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
                                        name={data}
                                        id="variations"
                                        className="delivery_option"
                                        disabled={
                                          variationValue &&
                                          variationValue.name &&
                                          variationValue.name.length != 0
                                            ? false
                                            : true
                                        }
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;
                                          const newValue =
                                            data?.value.toString();
                                          setAddOns((prev) => {
                                            if (isChecked) {
                                              return {
                                                ...prev,
                                                [item?.id]: [
                                                  ...(prev[item?.id] ?? []),
                                                  data?.value.toString(),
                                                ],
                                              };
                                            } else {
                                              const updatedAddOns = { ...prev };
                                              if (updatedAddOns[item?.id]) {
                                                updatedAddOns[item?.id] =
                                                  updatedAddOns[
                                                    item?.id
                                                  ].filter(
                                                    (value) =>
                                                      value !== newValue
                                                  );
                                              }
                                              return updatedAddOns;
                                            }
                                          });
                                        }}
                                      />
                                      <span class="checkmark"></span>
                                      <span
                                        className={
                                          variationValue &&
                                          variationValue.name &&
                                          variationValue.name.length != 0
                                            ? "varient_name"
                                            : "varient_name disabled"
                                        }
                                      >
                                        {data?.text ?? "N/A"}
                                      </span>
                                    </label>
                                  </td>
                                  <td
                                    style={{
                                      whiteSpace: "nowrap",
                                      userSelect: "none",
                                    }}
                                  >
                                    + {data?.price_formatted ?? "N/A"}
                                  </td>
                                </tr>
                              );
                            })}
                        </table>
                      </div>
                    </Fragment>
                  );
                })}

              <div className="col-auto">
                <div className="row">
                  {/* {foodValues?.masterAddons &&
              foodValues?.masterAddons.length != 0 && <hr />} */}
                  {foodValues?.masterAddons &&
                    foodValues?.masterAddons.length != 0 &&
                    foodValues?.masterAddons.map((item, index) => {
                      return (
                        <Fragment>
                          <div className="col">
                            <p className="sub_head_0291 mb-0" key={index}>
                              {item?.name ?? "N/A"}{" "}
                              {(item?.minimumRequired != 0 ||
                                item?.maximumRequired != 0) && (
                                <span className="info_label_0291">
                                  min -{" "}
                                  {item?.minimumRequired &&
                                    item?.minimumRequired != 0 &&
                                    item?.minimumRequired}{" "}
                                  {item?.maximumRequired &&
                                    item?.maximumRequired != 0 &&
                                    "| max -" + item?.maximumRequired}
                                </span>
                              )}
                            </p>
                            <div
                              className={
                                item.name +
                                item?.id +
                                item.minimumRequired +
                                item?.maximumRequired
                              }
                            >
                              <table className="menu_table_0291">
                                {item?.options &&
                                  item?.options.map((data, index) => {
                                    // const addOnsId =
                                    //   masterAddons && Object.keys(masterAddons);
                                    // const dataStr = addOnsId.find(
                                    //   (x) => x === item?.id
                                    // );
                                    // let strLen = 0;
                                    // const maxValue = parseInt(
                                    //   item?.maximumRequired
                                    // );
                                    // if (dataStr) {
                                    //   const addonsArray = masterAddons[dataStr];
                                    //   strLen = addonsArray
                                    //     ? addonsArray.length
                                    //     : 0;
                                    // }

                                    const container = document.querySelectorAll(
                                      `.${
                                        item.name +
                                        item?.id +
                                        item.minimumRequired +
                                        item?.maximumRequired
                                      }`
                                    );
                                    const checkboxes =
                                      container.length > 0
                                        ? container[0].querySelectorAll(
                                            'input[type="checkbox"]'
                                          )
                                        : null;

                                    let checkedCount = 0;

                                    checkboxes &&
                                      checkboxes.forEach((checkbox) => {
                                        if (checkbox.checked) {
                                          checkedCount++;
                                        }
                                      });

                                    // enable checked checkboxes
                                    checkboxes &&
                                      checkboxes.forEach((checkbox) => {
                                        if (checkbox.checked) {
                                          checkbox.disabled = false;
                                        }
                                      });
                                    const isCountCheck =
                                      checkedCount == item?.maximumRequired;
                                    const isVariationCheck =
                                      variationValue &&
                                      variationValue.name &&
                                      variationValue.name.length !== 0;

                                    return (
                                      <tr key={index}>
                                        <td className="d-flex">
                                          <label
                                            // htmlFor={varient?.name}
                                            className="delivery_option_container"
                                          >
                                            <input
                                              type="checkbox"
                                              name="addOns"
                                              id="variations"
                                              className="delivery_option variation_list"
                                              disabled={
                                                !isCountCheck &&
                                                isVariationCheck
                                                  ? false
                                                  : true
                                              }
                                              onChange={(e) => {
                                                const isChecked =
                                                  e.target.checked;
                                                const newValue =
                                                  data?.itemId.toString();
                                                setMasterAddons((prev) => {
                                                  if (isChecked) {
                                                    return {
                                                      ...prev,
                                                      [item?.id]: [
                                                        ...(prev[item?.id] ??
                                                          []),
                                                        data?.itemId.toString(),
                                                      ],
                                                    };
                                                  } else {
                                                    const updatedAddOns = {
                                                      ...prev,
                                                    };
                                                    if (
                                                      updatedAddOns[item?.id]
                                                    ) {
                                                      updatedAddOns[item?.id] =
                                                        updatedAddOns[
                                                          item?.id
                                                        ].filter(
                                                          (value) =>
                                                            value !== newValue
                                                        );
                                                    }
                                                    return updatedAddOns;
                                                  }
                                                });
                                              }}
                                            />
                                            <span class="checkmark"></span>
                                            <span
                                              className={
                                                !isCountCheck &&
                                                isVariationCheck
                                                  ? "varient_name"
                                                  : "varient_name disabled"
                                              }
                                            >
                                              {data?.text ?? "N/A"}
                                            </span>
                                          </label>
                                        </td>
                                        <td
                                          style={{
                                            whiteSpace: "nowrap",
                                            userSelect: "none",
                                          }}
                                        >
                                          + {data?.price_formatted ?? "N/A"}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </table>
                            </div>
                          </div>
                        </Fragment>
                      );
                    })}
                </div>
              </div>
            </div>
            <br />
            {foodValues?.online === "No" && (
              <p className="not_available_8392">
                Not Available for online purchase
              </p>
            )}
            <div className="btn_grp_8392">
              {foodValues?.online === "Yes" && (
                <button
                  type="button"
                  className="submit_btn_8392 btn_8392"
                  onClick={handleCart}
                  disabled={cartLoading}
                >
                  {cartLoading ? (
                    <Fragment>
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span class="sr-only"> Loading...</span>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <i>
                        <Bs.BsCart3 />
                      </i>
                      <span>Add to Cart</span>
                    </Fragment>
                  )}
                </button>
              )}
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
