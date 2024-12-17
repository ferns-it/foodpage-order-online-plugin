"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Lu from "react-icons/lu";
import * as Tb from "react-icons/tb";
import * as Md from "react-icons/md";
import * as Gr from "react-icons/gr";
import * as Io from "react-icons/io";
import { AppContext } from "../context";
import Utils from "../utils/Utils";
import AddOnsModal from "./AddOnsModal";
import OrderSummary from "./OrderSummary";
import { Toaster } from "react-hot-toast";
import FoodCardsSkeleton from "./FoodCardsSkeleton";
import SkeltLoader from "./SkeltLoader";

function FoodAccordian() {
  const {
    categoryList,
    fetchProductsList,
    cartItems,
    productsList,
    fetchSingleProduct,
    productsListLoading,
    categoryLoading,
  } = useContext(AppContext);
  const [accordionStates, setAccordionStates] = useState(null);
  const [products, setProducts] = useState(null);
  const [activeSmallScreen, setActiveSmallScreen] = useState(true);
  const [showRespModal, setShowRespModal] = useState(false);
  const [productRespDataValues, setProductRespDataValues] = useState(null);
  const [accordionIndex, setAccordionIndex] = useState(-1);

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

  useEffect(() => {
    if (!categoryList) return;
    setAccordionStates(new Array(categoryList.length).fill(false));
  }, [categoryList]);

  const toggleAccordion = (index) => {
    const newAccordionStates = [...accordionStates];
    newAccordionStates[index] = !newAccordionStates[index];
    setAccordionStates(newAccordionStates);
  };

  const collapseAll = () => {
    setAccordionStates(new Array(categoryList.length).fill(false));
  };

  const isAnyAccordionOpen =
    accordionStates && accordionStates.some((state) => state);

  const addOnsModalData = (product) => {
    setShowRespModal(true);
    setProductRespDataValues(product);
  };

  const cartTotal = cartItems?.cartTotal?.cartTotalPriceDisplay ?? 0;

  const handleToggleAccordion = async (index, category) => {
    if (!category) return;
    toggleAccordion(index);
    setAccordionIndex(index);
    const cID = category?.cID;
    const isCheck =
      productsList &&
      productsList.length != 0 &&
      productsList.some((x) => x.cID == cID);
    if (!isCheck) {
      await fetchSingleProduct(cID);
    }
  };

  const dragThreshold = 50;
  const handleDrag = (e, data) => {
    if (data.y >= dragThreshold) {
      setActiveSmallScreen(true);
    }
  };

  return (
    <Fragment>
      <Toaster />
      <AddOnsModal
        showModal={showRespModal}
        setShowModal={setShowRespModal}
        productData={productRespDataValues}
      />
      {categoryLoading ? (
        <SkeltLoader />
      ) : (
        <section className="accordian_wrapper_001">
          {isAnyAccordionOpen && (
            <button
              type="button"
              className="collapse_accordion_001"
              onClick={collapseAll}
            >
              <Tb.TbLayoutNavbarCollapseFilled /> <span>Collapse All</span>
            </button>
          )}
          {categoryList &&
            categoryList.length != 0 &&
            categoryList.map((list, index) => {
              return (
                <div className="accordian_space_001" key={index}>
                  <button
                    type="button"
                    className="accor_btn_001"
                    onClick={() => handleToggleAccordion(index, list)}
                  >
                    <span className="accord_category_name_19">
                      {list?.name ?? "N/A"}
                    </span>
                    <span
                      className={
                        accordionStates && accordionStates[index]
                          ? "accord_arrow_19 "
                          : "accord_arrow_19 down"
                      }
                    >
                      <Lu.LuArrowUpFromDot />
                    </span>
                  </button>

                  <div
                    className={
                      accordionStates && accordionStates[index]
                        ? "food_list_are_001"
                        : "food_list_are_001 hide"
                    }
                  >
                    {productsListLoading && accordionIndex === index ? (
                      <FoodCardsSkeleton />
                    ) : productsList && productsList.length !== 0 ? (
                      productsList
                        .filter((product) => product.cID === list.cID)
                        .flatMap((product) =>
                          product.products && product.products.length != 0 ? (
                            product.products.map((data, key) => (
                              <a
                                className="accord_food_anchor"
                                key={key}
                                onClick={() => addOnsModalData(data)}
                              >
                                <div className="card accord_food_card_19">
                                  <div className="row">
                                    <div className="col-9">
                                      <h2 className="accord_food_name_19">
                                        {data?.name ?? "N/A"}
                                      </h2>
                                      <p className="accord_desc_19">
                                        {data?.description &&
                                          Utils.removeSpecialCharacters(
                                            data?.description
                                          )}
                                      </p>
                                      <p className="accord_price_19">
                                        {data?.price ?? "N/A"}
                                      </p>
                                    </div>
                                    <div className="col-2">
                                      {/* <div className="accord_img_19">
                                        <img
                                          src={data?.photo}
                                          alt=""
                                          referrerPolicy="no-referrer"
                                        />
                                      </div> */}
                                      <button
                                        type="button"
                                        className="add_prod_"
                                      >
                                        <Io.IoIosAddCircle />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            ))
                          ) : (
                            <Fragment>
                              <h6 className="products_placeholder">
                                Dishes Not Available for Online
                              </h6>
                            </Fragment>
                          )
                        )
                    ) : (
                      <Fragment>
                        <h6 className="products_placeholder">
                          Dishes Not Available for Online
                        </h6>
                      </Fragment>
                    )}
                  </div>

                  <hr />
                </div>
              );
            })}
        </section>
      )}
      {/* <Draggable
        axis="y"
        bounds={{ top: 0 }}
        onDrag={handleDrag}
        defaultPosition={{ x: 1, y: 1 }}
      > */}
      <div
        className={activeSmallScreen ? "checkout_responsive_area" : "check-res"}
      >
        <div className="container">
          <div className="row">
            <div className="col-9">
              {activeSmallScreen ? (
                <button
                  className="checkout_resp_btn_021"
                  onClick={() => setActiveSmallScreen(!activeSmallScreen)}
                >
                  {cartItems?.cartItems.length ?? 0}{" "}
                  {cartItems?.cartItems.length > 1 ? "items" : "item"} to
                  Checkout
                </button>
              ) : (
                <button
                  className="tog"
                  onClick={() => setActiveSmallScreen(true)}
                >
                  <Md.MdOutlineClose />
                </button>
              )}
            </div>
            <div className="col-3">
              <div
                className="cart_items_length"
                onClick={() => setActiveSmallScreen(!activeSmallScreen)}
              >
                {" "}
                {cartTotal}
              </div>
            </div>
          </div>
          <div className="row">
            <OrderSummary />
          </div>
        </div>
      </div>
      {/* </Draggable> */}
    </Fragment>
  );
}

export default FoodAccordian;
