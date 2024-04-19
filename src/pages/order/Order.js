import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Md from "react-icons/md";
import * as Pi from "react-icons/pi";
import * as Fa from "react-icons/fa";
import * as Ti from "react-icons/ti";
import { AppContext } from "../../context/AppContext";

function Order() {
  const { menuList, menuLoading } = useContext(AppContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [delivery, setDelivey] = useState(false);
  const [filteredList, setFilteredList] = useState(null);
  const [activeChipIndex, setActiveChipIndex] = useState(0);
  const [itemCount, setItemCount] = useState(1);
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

  console.log("filteredList", filteredList);

  const handleItemClick = (index) => {
    setSelectedItem(index);
  };

  // fetch("https://foodpage.co.uk/development/v2/shop/products/1/0")
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     // Handle the JSON data received from the server
  //     console.log(data);
  //   })
  //   .catch((error) => {
  //     // Handle any errors that occurred during the fetch
  //     console.error("Fetch error:", error);
  //   });

  const handleKeyPress = (event) => {
    // Prevent input of negative symbol (-) if pressed
    if (event.key === "-" || event.key === "e") {
      event.preventDefault();
    }
  };
  const menuItems = [
    "STARTERS & SIDE DISHES",
    "PIZZA",
    "ITALIAN PASTA",
    "PIZZA & PASTA DEAL",
    "SALADS",
    "BURGERS",
    "BURGER MEALS",
    "DRINKS",
    "DESSERTS",
    "ICE CREAM",
    "SPECIAL OFFERS",
  ];
  function moveLeft() {
    const menuList = document.querySelector(".menu-list");
    const firstItem = menuList.querySelector("li:first-child");

    menuList.appendChild(firstItem);
  }

  function moveRight() {
    const menuList = document.querySelector(".menu-list");
    const lastItem = menuList.querySelector("li:last-child");

    menuList.insertBefore(lastItem, menuList.firstChild);
  }

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

          <div className="chip-container mt-4 d-flex">
            <button className="nav-btn left" onClick={moveLeft}>
              <i>
                <Fa.FaArrowLeft />
              </i>
            </button>
            <ul className="menu-list ">
              {menuItems.map((item, index) => (
                <li
                  className={index === activeChipIndex ? "active" : ""}
                  key={index}
                  onClick={() => setActiveChipIndex(index)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                </li>
              ))}
            </ul>
            <button className="nav-btn right" onClick={moveRight}>
              <i>
                <Fa.FaArrowRight />
              </i>
            </button>
          </div>
        </div>
        <div className="wrapper">
          <div className="container">
            <div className="food_order_area">
              <div className="order_block">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                    <div className="card food-card">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4">
                          <div className="food-img">
                            <img
                              src={require("../../assets/images/food.jpg")}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8">
                          <div className="food_content position-relative">
                            <h3>Russian Delight</h3>
                            <p className="rest_name">Restaurent Name</p>
                            <p className="desc_">
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Omnis nam quidem earum voluptatibus sunt
                              iusto praesentium, eius sapiente provident
                              corrupt. Lorem ipsum dolor sit amet consectetur
                              adipisicing elit. Error odio illo ipsa, inventore
                              quam omnis suscipit, quod est fugiat laborum
                              voluptate, architecto velit dicta reprehenderit
                              debitis enim perferendis dolore voluptatum?
                            </p>
                            <i className="food_type">
                              <div class="box">
                                <div class="circle"></div>
                              </div>
                            </i>
                            <p className="price_">£190</p>
                            <div className="wrapper__">
                              <div className="inc_dec_wrapper">
                                <button
                                  class="decrement"
                                  onClick={() => {
                                    itemCount >= 2 &&
                                      setItemCount(itemCount - 1);
                                  }}
                                >
                                  -
                                </button>
                                <p>{itemCount}</p>
                                <button
                                  class="increment"
                                  onClick={() => setItemCount(itemCount + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                className={
                                  !added ? "order_now" : "order_now added"
                                }
                                onClick={() => setAdded(!added)}
                                disabled={added}
                              >
                                {added ? <Fa.FaCheck /> : <Ti.TiPlus />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="billing_block bill-spikes">
                <h3 className="order_title">Order Summary</h3>
                <div className="summary_card card">
                  <p className="food_menu">Food Name</p>
                  <p className="price_summary_1">£190</p>

                  <button type="button" className="remove">
                    <Fa.FaRegTrashAlt />
                  </button>
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
                <br />
                <label htmlFor="" className="opt_label_827">
                  Postal Code
                </label>
                <input type="text" name="" id="" className="opt_input_827" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Order;
