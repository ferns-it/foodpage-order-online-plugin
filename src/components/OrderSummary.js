import React, { Fragment, useContext, useState } from "react";
import * as Fa from "react-icons/fa";
import * as Io from "react-icons/io";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

function OrderSummary() {
  const { cartItems, deleteSingleCartItem, cartLoading, fetchCartList } =
    useContext(AppContext);
  const [added, setAdded] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [showAddons, setShowAddons] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const toggleFoodLists = (index) => {
    if (index < 0) return;
    setShowAddons((prevList) => {
      const newList = Array.isArray(prevList) ? [...prevList] : [];
      const indexPosition = newList.indexOf(index);

      if (indexPosition === -1) {
        newList.push(index);
      } else {
        newList.splice(indexPosition, 1);
      }
      return newList;
    });
  };

  const handleDeleteItem = async (id, index) => {
    if (!id) return;
    setDeleteIndex(index);
    await deleteSingleCartItem(id, {
      onSuccess: async (res) => {
        await fetchCartList();
        console.log("Success response", res);
        toast.success("Item removed from your cart");
      },
      onFailed: (err) => {
        console.log("Error on delete cart item", err);
        toast.error("Delete cart item failed!");
      },
    });
  };

  return (
    <div>
      <h3 className="order_title">Order Summary</h3>
      <div className="summary_item_wrapper_029">
        {cartItems && cartItems.cartItems.length != 0 ? (
          <div className="summary_card card">
            {cartItems &&
              cartItems.cartItems.map((item, index) => {
                const addOns = item?.addon_apllied;
                const masterAddons = item?.master_addon_apllied;
                return (
                  <Fragment>
                    <div className="position-relative mb-4" key={index}>
                      <div className="d-flex">
                        <p className="food_menu m-0">
                          <strong>{item?.productName ?? "N/A"}</strong>
                          <button
                            className="summary_addons_collapse_btn"
                            onClick={() => toggleFoodLists(index)}
                          >
                            <Io.IoIosArrowRoundDown /> <span>Know more</span>
                          </button>
                        </p>
                        <p className="price_summary_1">
                          {item?.product_total_price}
                        </p>
                      </div>
                      <div
                        className={`add_ons_wrapper_order_summary ${
                          showAddons && showAddons.includes(index) ? "show" : ""
                        }`}
                      >
                        <table className="addOnsList028">
                          {addOns &&
                            addOns.length != 0 &&
                            addOns.map((add, index) => {
                              return (
                                <Fragment>
                                  <span key={index}>
                                    <strong>{add?.title}</strong>
                                  </span>
                                  {add &&
                                    add.choosedOption.length != 0 &&
                                    add.choosedOption.map((data, index) => {
                                      return (
                                        <tr>
                                          <td>{data?.text}</td>
                                          <td>{data?.price}</td>
                                        </tr>
                                      );
                                    })}
                                </Fragment>
                              );
                            })}
                        </table>
                        <table className="addOnsList028">
                          {masterAddons &&
                            masterAddons.length != 0 &&
                            masterAddons.map((add, index) => {
                              return (
                                <Fragment>
                                  <span key={index}>
                                    <strong>{add?.title}</strong>
                                  </span>
                                  {add &&
                                    add.choosedOption.length != 0 &&
                                    add.choosedOption.map((data, index) => {
                                      return (
                                        <tr key={index}>
                                          <td>{data?.text}</td>
                                          <td>{data?.price}</td>
                                        </tr>
                                      );
                                    })}
                                </Fragment>
                              );
                            })}
                        </table>
                      </div>
                      <div className="d-flex mt-2">
                        <div className="inc_dec_wrapper_order_summary">
                          <button className="summary_qty_btn dec_btn_order_summary">
                            -
                          </button>
                          <span>{item?.quantity}</span>
                          <button className="summary_qty_btn inc_btn_order_summary">
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="remove"
                          onClick={() => handleDeleteItem(item?.cartID, index)}
                          disabled={cartLoading && deleteIndex === index}
                        >
                          {cartLoading && deleteIndex === index ? (
                            <span
                              class="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <Fa.FaRegTrashAlt />
                          )}
                        </button>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            <hr className="mt-0" />
            <table className="total_cost_summary">
              <tr>
                <td>Total Cost</td>
                <td>{cartItems?.cartTotal?.cartTotalPriceDisplay ?? "N/A"}</td>
              </tr>
            </table>
          </div>
        ) : (
          <h3 className="empty_indic_order_summary">No items added yet!</h3>
        )}
      </div>

      <br />
      <div className="line__"></div>
      <div className="d-flex mt-4">
        <label htmlFor="delivery" className="delivery_option_container">
          <input
            type="radio"
            name="deliveryOption"
            id="delivery"
            className="delivery_option"
            checked={deliveryOption === "delivery"}
            onClick={() => setDeliveryOption("delivery")}
          />
          <span class="checkmark"></span>
          Delivery
        </label>
        <label htmlFor="takeAway" className="delivery_option_container">
          <input
            type="radio"
            name="deliveryOption"
            id="takeAway"
            className="ms-3 delivery_option"
            onClick={() => setDeliveryOption("takeaway")}
            checked={deliveryOption === "takeaway"}
          />
          <span class="checkmark"></span>
          Take away
        </label>
      </div>
      {deliveryOption === "delivery" ? (
        <Fragment>
          <label htmlFor="" className="opt_label_827">
            Postal Code
          </label>
          <div className="inp_wrapper_827">
            <input type="text" name="" id="" className="opt_input_827" />
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <label htmlFor="" className="opt_label_827">
            Picup Time
          </label>
          <div className="inp_wrapper_827">
            <input type="time" name="" id="" className="opt_input_827" />
          </div>
        </Fragment>
      )}
      <button type="button" className="order_now_192">
        Order Now
      </button>
    </div>
  );
}

export default OrderSummary;
