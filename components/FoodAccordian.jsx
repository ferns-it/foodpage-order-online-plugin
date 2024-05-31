import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Lu from "react-icons/lu";
import * as Tb from "react-icons/tb";
import { OrderOnlineContext } from "../context/OrderOnlineContext";
import Utils from "../utils/Utils";
import AddOnsModal from "./AddOnsModal";
import { MdOutlineClose } from "react-icons/md";
import "../style/OrderOnlineApp.css";
import OrderSummary from "./OrderSummary";
import { useParams } from "react-router-dom";
import SkeltLoader from "./SkeltLoader";

function FoodAccordian() {
  const { shopId } = useParams();
  const { categoryList, fetchProductsList, filterLoading } =
    useContext(OrderOnlineContext);
  const [accordionStates, setAccordionStates] = useState(null);
  const [activeSmallScreen, setActiveSmallScreen] = useState(true);
  const [products, setProducts] = useState(null);
  const [showRespModal, setShowRespModal] = useState(false);
  const [productRespDataValues, setProductRespDataValues] = useState(null);

  useEffect(() => {
    if (!categoryList || categoryList.length === 0) return;

    const fetchData = async () => {
      const pro = await Promise.all(
        categoryList.map(async (item) => {
          const data = {
            shopId: shopId,
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

  return (
    <Fragment>
      <AddOnsModal
        showModal={showRespModal}
        setShowModal={setShowRespModal}
        productData={productRespDataValues}
      />

      <Fragment>
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
          {products &&
            products.length != 0 &&
            products.map((list, index) => {
              const productData = list?.product;
              return (
                <div className="accordian_space_001" key={index}>
                  <button
                    type="button"
                    className="accor_btn_001"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="accord_category_name_19">
                      {list?.categoryName ?? "N/A"}
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
                    {productData &&
                      productData.length != 0 &&
                      productData.map((product, index) => {
                        return (
                          <a
                            className="accord_food_anchor mb-2"
                            key={index}
                            onClick={() => addOnsModalData(product)}
                          >
                            <div className="card accord_food_card_19">
                              <div className="row">
                                <div className="col-8">
                                  <h2 className="accord_food_name_19">
                                    {product?.name ?? "N/A"}
                                  </h2>
                                  <p className="accord_desc_19">
                                    {product?.description &&
                                      Utils.removeSpecialCharacters(
                                        product?.description
                                      )}
                                  </p>
                                  <p className="accord_price_19">{product?.price}</p>
                                </div>
                                <div className="col-4">
                                  <div className="accord_img_19">
                                    <img src={product?.photo} alt="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                  </div>
                  <hr />
                </div>
              );
            })}
        </section>
        <div
          className={
            activeSmallScreen ? "checkout_responsive_area" : "check-res"
          }
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                {activeSmallScreen ? (
                  <button
                    className="checkout_resp_btn_021"
                    onClick={() => setActiveSmallScreen(!activeSmallScreen)}
                  >
                    Checkout
                  </button>
                ) : (
                  <button
                    className="tog"
                    onClick={() => setActiveSmallScreen(true)}
                  >
                    <MdOutlineClose />
                  </button>
                )}
              </div>
            </div>
            <div className="row">
              <OrderSummary />
            </div>
          </div>
        </div>
      </Fragment>
    </Fragment>
  );
}

export default FoodAccordian;
