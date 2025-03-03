"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import "../style/order-online-style.css";
import FoodCards from "../components/FoodCards";
import OrderSummary from "../components/OrderSummary";
import FoodAccordian from "../components/FoodAccordian";
import { useRouter } from "next/navigation";
import LoaderComp from "../components/LoaderComp";
import { TableReservationContext } from "../../table-reservation/context/TableReservationContext";
import "../../table-reservation/style/style.css";
import "../style/order-online-style.css";
import { ImSpoonKnife } from "react-icons/im";
import { BiFoodMenu } from "react-icons/bi";


const OrderOnlineMain = () => {
  const router = useRouter();
  const {
    categoryList,
    productsList,
    fetchSingleProduct,
    categoryLoading,
    settings,
    settingsLoading,
    menuLoading,
  } = useContext(AppContext);
  const [activeChipIndex, setActiveChipIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!categoryList) return;
    const catName = categoryList[0]?.name;
    setSelectedCategory(catName);
    setActiveChipIndex(0);
  }, [categoryList]);

  // useEffect(() => {
  //   if (!shopId) return;
  //   getShopTiming(shopId);
  // }, [shopId]);

  const handleChipClick = async (index, catName, cID) => {
    setActiveChipIndex(index);
    setSelectedCategory(catName);

    const isCheck =
      productsList &&
      productsList.length != 0 &&
      productsList.some((x) => x.cID == cID);
    if (!isCheck) {
      await fetchSingleProduct(cID);
    }
  };

  const handleScroll = () => {
    if (window.pageYOffset >= 100) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function stripHtml(html) {
    const temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  // const title = settings && settings?.themeTitle ? JSON.parse(settings?.themeTitle) : "";
  // console.log("title", title);
  return (
    <Fragment>
      {!settingsLoading ? (
        <Fragment>
          <br />
          <div className="food_order_area mt-4">
            <div className="order_block">
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-none cat_col_0229">
                  <div className="card category_card_009">
                    <ul className="food_category_009">
                      {categoryLoading ? (
                        <Fragment>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div className="nav-link-static">
                            <ImSpoonKnife size={30} /> <BiFoodMenu size={30} />{" "}
                            <b>Menu</b>
                          </div>
                          {categoryList &&
                            categoryList.length > 0 &&
                            categoryList.map((list, index) => {
                              const children = list?.childrens;

                              if (children && children.length > 0) {
                                const hasValidChildren = children.some(
                                  (child) => child.productsCount?.online > 0
                                );

                                if (hasValidChildren) {
                                  return (
                                    <a
                                      key={index}
                                      className={
                                        index === activeChipIndex
                                          ? "nav-link active_009"
                                          : "nav-link"
                                      }
                                      onClick={() =>
                                        handleChipClick(
                                          index,
                                          list?.name,
                                          list?.cID
                                        )
                                      }
                                    >
                                      <li>{list?.name}</li>
                                      <i>{/* Optional icon */}</i>
                                    </a>
                                  );
                                }
                              } else if (list.productsCount?.online > 0) {
                                return (
                                  <a
                                    key={index}
                                    className={
                                      index === activeChipIndex
                                        ? "nav-link active_009"
                                        : "nav-link"
                                    }
                                    onClick={() =>
                                      handleChipClick(
                                        index,
                                        list?.name,
                                        list?.cID
                                      )
                                    }
                                  >
                                    <li>{list?.name}</li>
                                    <i>{/* Optional icon */}</i>
                                  </a>
                                );
                              }

                              return null;
                            })}
                        </Fragment>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-9 col-md-12 col-sm-12">
                  <section className="foodmenuList">
                    <FoodCards category={selectedCategory} />
                    <FoodAccordian />
                  </section>
                </div>
              </div>
            </div>

            <div className="billing_area">
              <div
                className={
                  isSticky
                    ? "billing_block_order_plugin sticky bill-spikes"
                    : "billing_block_order_plugin bill-spikes"
                }
                // className="billing_block_order_plugin bill-spikes"
              >
                <OrderSummary />
              </div>
            </div>
          </div>
          <div className="Order-online-Section">
            {" "}
            <div className="sec-container">
              <h1 className="head-order">How Does Muziris.uk Work</h1>
            </div>
          </div>
          <div className="order-banner">
            <div className="row">
            
             
            </div>
          </div>
        </Fragment>
      ) : (
        <LoaderComp />
      )}
    </Fragment>
  );
};

export default OrderOnlineMain;
