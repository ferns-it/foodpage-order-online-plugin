"use client";
import React, {
  Fragment,
  useContext,
  useEffect,
  useInsertionEffect,
  useRef,
  useState,
} from "react";
import * as Io5 from "react-icons/io5";
import * as Bs from "react-icons/bs";
import Utils from "../utils/Utils";
import toast, { Toaster } from "react-hot-toast";
import { AppContext } from "../context";
import MasterAddOnsCheckbox from "./MasterAddOnsCheckbox";
import VariationMasterAddons from "./variationMasterAddons";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../../_utils/ClientUtils";

let userId = getLocalStorageItem("UserPersistent");

function AddOnsModal(props) {
  const modalRef = useRef(null);
  const { addToCart, fetchCartList, cartLoading, shopId, setCartItems } =
    useContext(AppContext);

  const [count, setCount] = useState(1);
  const [cardTotal, setCardTotal] = useState(0);
  const [variationValue, setVariationValue] = useState({
    name: "",
    pvID: "",
    price: 0,
  });
  const [addOns, setAddOns] = useState({});
  const [masterAddons, setMasterAddons] = useState({});
  const [masterIds, setMasterIds] = useState([]);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [variationAddOns, setVariationAddOns] = useState(null);
  // const [variationAddOnsData, ]
  const foodValues = props.productData;

  const emptyStates = () => {
    setCount(1);
    setVariationValue({
      name: "",
      pvID: "",
      price: 0,
    });
    setAddOns({});
    setMasterAddons({});
    setItemData(null);
    setVariationAddOns(null);
  };

  useEffect(() => {
    // if (!props.showModal) return;
    if (props.showModal == false) {
      emptyStates();
    }
  }, [props.showModal]);

  useEffect(() => {
    console.log("called", variationValue);
  }, [variationValue]);

  const handleClickOutside = async (event) => {
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

  useEffect(() => {
    if (userId == null) {
      debugger;
      const tempId = Utils.generateRandomId();
      setLocalStorageItem("UserPersistent", tempId);
    }
  }, []);

  useEffect(() => {
    const productDatas = props.productData;

    if (props.productData && props.showModal == true) {
      setItemData(productDatas);
    }
    if (!productDatas) return;

    if (productDatas?.isMeal === true) {
      productDatas.variations?.forEach((varient) => {
        const pvID = varient?.pvID;

        if (pvID && varient?.variationmasteraddons) {
          const data = {
            pVID: pvID,
            masterAddons: varient.variationmasteraddons,
          };

          setVariationAddOns((prev) => {
            const newVariationAddOns = Array.isArray(prev) ? prev : [];

            const filteredAddOns = newVariationAddOns.filter(
              (item) => item.pVID !== pvID
            );

            return [...filteredAddOns, data];
          });
        }
      });
    }
  }, [props]);

  const getVariationValue = () => {
    if (!itemData) return;

    const variationData = itemData?.variations?.[0];

    if (!variationData || variationData.name == null) {
      setVariationValue({
        name: itemData.name,
        price: variationData?.price,
        pvID: variationData?.pvID,
      });
    }

    let totalAmount = 0;
    if (variationValue?.name == "") {
      totalAmount = (props.productData.priceValue * count) / 100;
    } else {
      const priceAmt =
        typeof variationValue?.price == "string"
          ? parseInt(variationValue?.price)
          : variationValue?.price;

      totalAmount = priceAmt * count;
    }

    setCardTotal(totalAmount);
  };

  useEffect(() => {
    getVariationValue();
  }, [itemData, count]);

  if (!props.showModal || !props.productData) return;

  const handleDecrement = () => {
    if (count === 1) return;
    setCount(count - 1);
  };

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
    if (!userId) {
      userId = Utils.generateRandomId();
      setLocalStorageItem("UserPersistent", userId);
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
    const productData = props?.productData;

    if (!productData) return;

    if (productData?.isMeal == true) {
      const selectedVariation =
        variationAddOns &&
        variationAddOns.find((x) => x.pVID == variationValue?.pvID);

      const varMasterAddOns =
        selectedVariation && selectedVariation.masterAddons;

      const addonsMap = new Map(
        varMasterAddOns && varMasterAddOns.map((addon) => [addon.id, addon])
      );

      const hasError = varMasterAddOns.some((option) => {
        const selectedOptions = masterAddons[option.id] || [];
        const minimumRequired = parseInt(option.minimumRequired, 10);

        if (selectedOptions.length < minimumRequired) {
          toast.error(
            `Minimum ${minimumRequired} options required for ${option.name}`
          );
          return true;
        }

        return false;
      });

      if (hasError === true) return;
    }

    // Perform additional validation on masterAddons
    // if (Object.keys(masterAddons).length !== 0) {
    //   Object.keys(masterAddons).forEach((key) => {
    //     const addon = addonsMap.get(key);

    //     if (addon) {
    //       const minRequired = parseInt(addon.minimumRequired, 10);

    //       const selectedItemsCount = masterAddons[key].length;

    //       // Check if the selected items count is less than the minimum required
    //       if (selectedItemsCount < minRequired) {
    //         toast.error(
    //           `The number of selected items (${selectedItemsCount}) for addon ID ${key} is less than the minimum required (${minRequired})`
    //         );
    //         return;
    //       }
    //     }
    //   });
    // }

    const masterAddOnsData = productData?.masterAddons;

    if (masterAddOnsData && masterAddOnsData.length != 0) {
      const addOnsData = handleMinAddons(masterAddOnsData);

      const isValidAddOns =
        addOnsData &&
        Array.isArray(addOnsData) &&
        addOnsData.length != 0 &&
        addOnsData.map((item) => {
          const itemRequired =
            item?.minimumRequired && typeof item?.minimumRequired == "string"
              ? parseInt(item?.minimumRequired)
              : item?.minimumRequired;

          const optionLength = item?.options ? item?.options.length : 0;

          if (itemRequired > optionLength) {
            return {
              isValid: false,
              minRequired: itemRequired,
              name: item?.name,
            };
          } else {
            return {
              isValid: true,
              minRequired: itemRequired,
              name: item?.name,
            };
          }
        });

      const allValid = isValidAddOns.every((result) => result.isValid);
      if (!allValid) {
        isValidAddOns.map((itemData) => {
          if (itemData?.isValid == false) {
            toast.error(
              `Please choose minimum of ${itemData?.minRequired ?? 0} for ${
                itemData?.name ?? "N/A"
              }`
            );
          }
        });

        return;
      }
    }

    let cOptionObj = {
      pvID: variationValue?.pvID,
      addons: addOns,
      masterAddons: masterAddons,
    };
    const payload = {
      qty: count,
      rID: JSON.stringify(shopId),
      pID: itemData?.pID,
      cOption: JSON.stringify(cOptionObj),
    };
    let headers = {
      User: userId,
    };

    await addToCart(payload, {
      headers: headers,
      onSuccess: async (res) => {
        toast.success("Item Added to cart!");

        // await fetchCartList(userId);
        // debugger;

        const cartItems = res?.data?.data?.data;
        setCartItems(cartItems);

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
      <Toaster />
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
            <img
              src={itemData && itemData?.photo}
              alt=""
              referrerPolicy="no-referrer"
            />
          </div>

          <button
            className="close_02901"
            onClick={async () => {
              props.setShowModal(false);
            }}
          >
            <Io5.IoCloseCircle />
          </button>
          <div className="container content_container_02901">
            <h2 className="food_name_02901">{itemData?.name ?? "N/A"}</h2>
            <p className="food_desc_02901">
              {itemData?.description &&
                Utils.removeSpecialCharacters(itemData?.description)}
            </p>
            <p className="price_02901">
              {/* £{total && total.length != 0 ? total.toFixed(2) : 0} */}£
              {cardTotal}
            </p>
            <div className="inc_dec_wrapper_0291">
              <div className="incDec_wrapper_0291">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-checkbox"
                  defaultChecked={false}
                />
                <div className="counter-container">
                  <label
                    for="toggle"
                    className="decrement-button m-0"
                    onClick={handleDecrement}
                  >
                    -
                  </label>
                  <span className="counter-text">{count}</span>
                  <label
                    for="toggle"
                    className="increment-button red m-0"
                    onClick={() => setCount(count + 1)}
                  >
                    +
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              {foodValues &&
                foodValues.variations &&
                foodValues?.variations[0].name != null && (
                  <div className="col">
                    <p className="sub_head_0291">Choose One</p>
                    <table className="menu_table_0291">
                      {foodValues &&
                        foodValues.variations &&
                        foodValues?.variations.length != 0 &&
                        foodValues.variations.map((varient, index) => {
                          const variationName = varient?.name
                            ? varient?.name
                            : foodValues?.name;

                          if (variationName == null) {
                            setVariationValue({
                              name: foodValues.name,
                              // price: variationData?.price,
                              // pvID: variationData?.pvID,
                            });
                          }

                          return (
                            <Fragment>
                              {varient.name != null ? (
                                <Fragment>
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
                                          checked={
                                            variationValue.name ===
                                              variationName &&
                                            variationValue.pvID == varient?.pvID
                                          }
                                          onClick={() => {
                                            setVariationValue({
                                              name: varient?.name
                                                ? varient?.name
                                                : foodValues.name,
                                              pvID: varient?.pvID,
                                              price: varient?.price,
                                            });
                                            setCardTotal(varient?.price ?? 0);
                                            setCount(1);
                                            if (
                                              props?.productData?.isMeal == true
                                            ) {
                                              setMasterAddons({});
                                            }
                                          }}
                                        />
                                        <span className="checkmark"></span>
                                        <span className="varient_name">
                                          {varient?.name ?? "N/A"}
                                        </span>
                                      </label>
                                    </td>
                                    <td style={{ userSelect: "none" }}>
                                      {varient?.displayPrice ?? "N/A"}
                                    </td>
                                  </tr>
                                  <p className="small_desc">
                                    {Utils.stripHtml(varient?.ingredients) ??
                                      ""}
                                  </p>
                                </Fragment>
                              ) : (
                                ""
                              )}
                            </Fragment>
                          );
                        })}
                    </table>
                  </div>
                )}

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
                                <tr key={index}>
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
                                        defaultChecked={false}
                                      />
                                      <span className="checkmark"></span>
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
                  <MasterAddOnsCheckbox
                    foodValues={foodValues}
                    setMasterAddons={setMasterAddons}
                    variationValue={variationValue}
                    setLimitExceeded={setLimitExceeded}
                  />
                </div>
              </div>
            </div>
            {variationAddOns != null &&
              variationAddOns.length != 0 &&
              variationAddOns.map((data, index) => {
                if (data?.pVID == variationValue?.pvID) {
                  return (
                    <Fragment>
                      <VariationMasterAddons
                        foodValues={data}
                        setMasterAddons={setMasterAddons}
                        variationValue={variationValue}
                        setLimitExceeded={setLimitExceeded}
                      />
                    </Fragment>
                  );
                }
              })}
            <br />
            {foodValues?.online === "No" && (
              <p className="not_available_8392">
                Not Available for online purchase
              </p>
            )}
            {(foodValues?.online === "No" ||
              foodValues?.isAvailable === false ||
              foodValues?.availability === false) && (
              <p className="text-center mx-auto red ">
                This product is currently Unavailable
              </p>
            )}
            <p className="err_">
              {limitExceeded
                ? "You have reached the maximum limit of selections."
                : ""}
            </p>
            <div className="btn_grp_8392">
              {foodValues?.online === "Yes" &&
                foodValues?.isAvailable != false &&
                foodValues?.availability != false && (
                  <button
                    type="button"
                    className="submit_btn_8392 btn_8392"
                    onClick={() => handleCart()}
                    disabled={cartLoading}
                  >
                    {cartLoading ? (
                      <Fragment>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only"> Loading...</span>
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
