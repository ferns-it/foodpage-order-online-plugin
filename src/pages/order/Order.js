import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Md from "react-icons/md";
import * as Pi from "react-icons/pi";
import * as Fa from "react-icons/fa";
import * as Ti from "react-icons/ti";
import * as Lu from "react-icons/lu";
import * as Bs from "react-icons/bs";
import { AppContext } from "../../context/AppContext";
import Foodcard from "../../components/Foodcard";

function Order() {
  const {
    menuList,
    menuLoading,
    categoryList,
    fetchProductsList,
    productsList,
  } = useContext(AppContext);
  const [filteredList, setFilteredList] = useState(null);
  const [activeChipIndex, setActiveChipIndex] = useState(-1);
  const [added, setAdded] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  

  useEffect(() => {
    if (!menuList) return;

    const data =
      menuList?.items &&
      Array.isArray(menuList?.items) &&
      menuList?.items.filter((item) => {
        if (item?.isAvailable === true) return item;
      });

    setFilteredList(data);
  }, [menuList]);

  // useEffect(() => {
  //   if (!categoryList || categoryList.length === 0) return;

  //   const fetchData = async () => {
  //     const pro = await Promise.all(
  //       categoryList.map(async (item) => {
  //         const data = {
  //           shopId: 1,
  //           categoryId: item?.cID,
  //         };

  //         const productRespo = await fetchProductsList(data);
  //         return { categoryName: item?.name, product: productRespo };
  //       })
  //     );
  //     setProducts(pro);
  //   };

  //   fetchData();
  // }, [categoryList]);

  const handleChipClick = (index) => {
    setActiveChipIndex(index);
    
    const sectionId = document.getElementById(`category-${index}`);
    if (sectionId) {
      sectionId.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Fragment>
      <section className="order-online">
        <div className="container position-relative">
          <p className="info-header">
            <i>
              <Pi.PiCallBellFill />
            </i>
            Mild Medium Hot Gluten Milk NUts Vegetarian We can accommodate most
            allergies, if you have any allergies please inform us when ordering.
          </p>
        </div>
        <div className="wrapper_102322">
          <div className="container">
            <div className="food_order_area">
              <div className="order_block">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-3">
                    <div className="card category_card_009 p-2">
                      <ul className="food_category_009">
                        {categoryList &&
                          categoryList.length != 0 &&
                          categoryList.map((list, index) => {
                            return (
                              <a
                                href={`#category-${index}`}
                                className={
                                  index === activeChipIndex
                                    ? "nav-link active_009"
                                    : "nav-link"
                                }
                                key={index}
                                onClick={() => handleChipClick(index)}
                              >
                                <li>{list?.name}</li>
                                <i>
                                  <Lu.LuArrowRightToLine />
                                </i>
                              </a>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-sm-9">
                    <Foodcard />
                  </div>
                </div>
              </div>
              <div className="billing_block bill-spikes">
                <h3 className="order_title">Order Summary</h3>
                <div className="summary_item_wrapper_029">
                  {added && (
                    <div className="summary_card card">
                      <p className="food_menu">Food Name</p>
                      <p className="price_summary_1">£190</p>

                      <button
                        type="button"
                        className="remove"
                        onClick={() => setAdded(false)}
                      >
                        <Fa.FaRegTrashAlt />
                      </button>
                    </div>
                  )}
                  <div className="summary_card card">
                    <p className="food_menu">Food Name</p>
                    <p className="price_summary_1">£190</p>

                    <button
                      type="button"
                      className="remove"
                      onClick={() => setAdded(false)}
                    >
                      <Fa.FaRegTrashAlt />
                    </button>
                  </div>
                  <div className="summary_card card">
                    <p className="food_menu">Food Name</p>
                    <p className="price_summary_1">£190</p>

                    <button
                      type="button"
                      className="remove"
                      onClick={() => setAdded(false)}
                    >
                      <Fa.FaRegTrashAlt />
                    </button>
                  </div>
                  <div className="summary_card card">
                    <p className="food_menu">Food Name</p>
                    <p className="price_summary_1">£190</p>

                    <button
                      type="button"
                      className="remove"
                      onClick={() => setAdded(false)}
                    >
                      <Fa.FaRegTrashAlt />
                    </button>
                  </div>
                  <div className="summary_card card">
                    <p className="food_menu">Food Name</p>
                    <p className="price_summary_1">£190</p>

                    <button
                      type="button"
                      className="remove"
                      onClick={() => setAdded(false)}
                    >
                      <Fa.FaRegTrashAlt />
                    </button>
                  </div>
                </div>

                <br />
                <div className="line__"></div>
                <div className="d-flex mt-4">
                  <label
                    htmlFor="delivery"
                    className="delivery_option_container"
                  >
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
                  <label
                    htmlFor="takeAway"
                    className="delivery_option_container"
                  >
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
                      <input
                        type="text"
                        name=""
                        id=""
                        className="opt_input_827"
                      />
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <label htmlFor="" className="opt_label_827">
                      Picup Time
                    </label>
                    <div className="inp_wrapper_827">
                      <input
                        type="time"
                        name=""
                        id=""
                        className="opt_input_827"
                      />
                    </div>
                  </Fragment>
                )}
                <button type="button" className="order_now_192">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="footer_98_"></div>
      </section>
    </Fragment>
  );
}

export default Order;
