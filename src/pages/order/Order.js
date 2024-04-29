import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import * as Md from "react-icons/md";
import * as Pi from "react-icons/pi";
import * as Fa from "react-icons/fa";
import * as Ti from "react-icons/ti";
import * as Lu from "react-icons/lu";
import * as Bs from "react-icons/bs";
import { AppContext } from "../../context/AppContext";
import Foodcard from "../../components/Foodcard";
import FoodAccordian from "../../components/FoodAccordian";
import Utils from "../../utils/Utils";

function Order() {
  const { menuList, categoryList, cartItems } = useContext(AppContext);
  const [filteredList, setFilteredList] = useState(null);
  const [activeChipIndex, setActiveChipIndex] = useState(-1);
  const [added, setAdded] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [isSticky, setIsSticky] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleScroll = () => {
    if (window.pageYOffset >= 100) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  console.log(cartItems);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const handleChipClick = (index, catName) => {
    setActiveChipIndex(index);
    setSelectedCategory(catName);
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
          <div className="container-fluid">
            <div className="food_order_area">
              <div className="order_block">
                <div className="row">
                  <div className="col-lg-3 col-md-4 col-sm-none cat_col_0229">
                    <div className="card category_card_009 p-2">
                      <ul className="food_category_009">
                        <a
                          className={
                            activeChipIndex === -1
                              ? "nav-link active_009"
                              : "nav-link"
                          }
                          onClick={() => {
                            setActiveChipIndex(-1);
                            setSelectedCategory("All");
                          }}
                        >
                          <li>All</li>
                          <i>
                            <Lu.LuArrowRightToLine />
                          </i>
                        </a>
                        {categoryList &&
                          categoryList.length != 0 &&
                          categoryList.map((list, index) => {
                            return (
                              <a
                                // href={`#category-${index}`}
                                className={
                                  index === activeChipIndex
                                    ? "nav-link active_009"
                                    : "nav-link"
                                }
                                key={index}
                                onClick={() =>
                                  handleChipClick(index, list?.name)
                                }
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
                  <div className="col-lg-9 col-md-8 col-sm-12 food_area_col">
                    <Foodcard category={selectedCategory} />
                    <FoodAccordian />
                  </div>
                </div>
              </div>

              <div
                className={
                  isSticky
                    ? "billing_block sticky bill-spikes"
                    : "billing_block bill-spikes"
                }
              >
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
