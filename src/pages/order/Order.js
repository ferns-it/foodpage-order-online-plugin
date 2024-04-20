import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Md from "react-icons/md";
import * as Pi from "react-icons/pi";
import * as Fa from "react-icons/fa";
import * as Ti from "react-icons/ti";
import * as Lu from "react-icons/lu";
import * as Bs from "react-icons/bs";
import { AppContext } from "../../context/AppContext";

function Order() {
  const {
    menuList,
    menuLoading,
    categoryList,
    fetchProductsList,
    productsList,
  } = useContext(AppContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [delivery, setDelivey] = useState(false);
  const [filteredList, setFilteredList] = useState(null);
  const [activeChipIndex, setActiveChipIndex] = useState(-1);
  const [itemCount, setItemCount] = useState(1);
  const [added, setAdded] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [products, setProducts] = useState(null);

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

  useEffect(() => {
    if (!categoryList || categoryList.length === 0) return;

    const fetchData = async () => {
      const pro = await Promise.all(
        categoryList.map(async (item) => {
          const data = {
            shopId: 1,
            categoryId: item?.cID,
          };

          const productRespo = await fetchProductsList(data);
          return { categoryName: item?.name, product: productRespo };
        })
      );
      setProducts(pro);
    };

    fetchData();
  }, [categoryList]);

  // console.log("products", products);

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
        </div>
        <div className="wrapper_102322">
          <div className="container">
            <div className="food_order_area">
              <div className="order_block">
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <div className="card category_card_009 p-2">
                      <ul className="food_category_009">
                        {categoryList &&
                          categoryList.length != 0 &&
                          categoryList.map((list, index) => {
                            return (
                              <a
                                href={`#${list?.name}`}
                                className={
                                  index === activeChipIndex
                                    ? "nav-link active_009"
                                    : "nav-link"
                                }
                                key={index}
                                onClick={() => setActiveChipIndex(index)}
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
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    {products &&
                      products.length != 0 &&
                      products.map((list, key) => {
                        const productData = list?.product;
                        return (
                          <div className="product_wrapper_029" key={key}>
                            <h3 className="cat_2901">
                              {list?.categoryName ?? "N/A"}
                            </h3>
                            <div className="row">
                              {productData &&
                                productData.length != 0 &&
                                productData.map((product, index) => {
                                  return (
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                      <div className="food_card_029">
                                        <div className="prod_img_029">
                                          <img src={product?.photo} alt="" />
                                        </div>
                                        <div className="food_content_029">
                                          <div className="content_029">
                                            <p className="food_name_029">
                                              {product?.name ?? "N/A"}
                                            </p>
                                            <p className="desc_029">
                                              {product?.description ?? "N/A"}
                                            </p>
                                            {/* <button type="button" className="buy_now_029">Buy now</button> */}
                                          </div>

                                        </div>
                                          <button
                                            type="button"
                                            className="cart_btn_029"
                                          >
                                            <Bs.BsCart3 />
                                          </button>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        );
                      })}
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
