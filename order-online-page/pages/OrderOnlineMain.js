"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import "../style/order-online-style.css";
import FoodCards from "../components/FoodCards";
import OrderSummary from "../components/OrderSummary";
import FoodAccordian from "../components/FoodAccordian";
import { MdTableBar } from "react-icons/md";
import { useRouter } from "next/navigation";
import LoaderComp from "../components/LoaderComp";
import { TableReservationContext } from "../../table-reservation/context/TableReservationContext";
import Utils from "../../table-reservation/utils/Utils";
import "../../table-reservation/style/style.css";
import "../style/order-online-style.css";

const ThemeTitle = ({ htmlString }) => {
  const cleanHtmlString = htmlString.replace(/\r\n/g, "");

  return (
    <div
      className="banner_title"
      dangerouslySetInnerHTML={{ __html: cleanHtmlString }}
    />
  );
};

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
    mergedState,
  } = useContext(AppContext);
  const {
    getShopTiming,
    shopTiming,
    isTimingLoading,
    // reservationLoading,
    // sendReservationOTP,
    // setInitialValues,
    // initialValues,
    // secretKey,
    // setSecretKey,
  } = useContext(TableReservationContext);
  const [activeChipIndex, setActiveChipIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const shopId = process.env.SHOP_ID;

  console.log("mergedState", mergedState);

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
    if (window.pageYOffset >= 150) {
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
  console.log(categoryList, "categorylIst");
  return (
    <Fragment>
      {!settingsLoading ? (
        <Fragment>
          <br />
          <div className="food_order_area mt-4">
            <div className="order_block">
              <div className="row position-relative">
                <div className="col-lg-3 col-md-3 col-sm-none cat_col_0229 ">
                  <div
                    className="card category_card_009"
                    
                  >
                    <ul className="food_category_009" style={{ marginTop: "100px" }}>
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
                          {mergedState &&
                            mergedState.length > 0 &&
                            mergedState.map((list, index) => {
                              const children = list?.category?.childrens;

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
                                      // onClick={() =>
                                      //   handleChipClick(
                                      //     index,
                                      //     list?.category?.name,
                                      //     list?.category?.cID
                                      //   )
                                      // }
                                      href={`#${list?.category?.name}`}
                                    >
                                      <li>{list?.category?.name}</li>
                                      <i>{/* Optional icon */}</i>
                                    </a>
                                  );
                                }
                              } else if (
                                list?.category?.productsCount?.online > 0
                              ) {
                                return (
                                  <a
                                    key={index}
                                    className={
                                      index === activeChipIndex
                                        ? "nav-link active_009"
                                        : "nav-link"
                                    }
                                    href={`#${list?.category?.name}`}
                                    // onClick={() =>
                                    //   handleChipClick(
                                    //     index,
                                    //     list?.category?.name,
                                    //     list?.category?.cID
                                    //   )
                                    // }
                                  >
                                    <li>{list?.category?.name}</li>
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
        </Fragment>
      ) : (
        <LoaderComp />
      )}
    </Fragment>
  );
};

export default OrderOnlineMain;
