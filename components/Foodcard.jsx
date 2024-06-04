import React, { Fragment, useContext, useEffect, useState } from "react";
import { OrderOnlineContext } from "../context/OrderOnlineContext";
import Utils from "../utils/Utils";
import AddOnsModal from "./AddOnsModal";
import "../style/OrderOnlineApp.css";
import { useParams } from "react-router-dom";
import SkeltLoader from "./SkeltLoader";
import { AppContext } from "../../../Context/AppContext";

function Foodcard(category) {
  const { shopId } = useParams();
  const { products, productsLoading, filterLoading } =
    useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [productDataValues, setProductDataValues] = useState(null);

  // useEffect(() => {
  //   if (showModal == true) {
  //     document.body.style.overflow = "hidden";
  //     document.documentElement.style.overflow = "hidden";
  //   }
  //   if (showModal == false) {
  //     document.body.style.overflow = "auto";
  //     document.documentElement.style.overflow = "auto";
  //   }
  // }, [showModal]);

  const addOnsModalData = (product) => {
    if (!product) return;
    setShowModal(true);
    setProductDataValues(product);
  };

  return (
    <Fragment>
      <AddOnsModal
        showModal={showModal}
        setShowModal={setShowModal}
        productData={productDataValues}
        shopId={shopId}
      />
      {productsLoading === false ? (
        <Fragment>
          {products &&
            products.length != 0 &&
            products.map((list, key) => {
              const productData = list?.product;

              if (
                productData.length != 0 &&
                (list?.categoryName == category.category ||
                  category.category === "All")
              ) {
                return (
                  <div
                    className="product_wrapper_029"
                    id={`category-${list?.categoryId}`}
                    key={key}
                  >
                    <h3 className="cat_2901"> {list?.categoryName ?? "N/A"}</h3>
                    <br />
                    <div className="row">
                      {productData &&
                        productData.length != 0 &&
                        productData.map((product, index) => {
                          console.log("productData", product);
                          return (
                            <div
                              className="col-lg-4 col-md-4 col-sm-4"
                              key={index}
                            >
                              <div className="food_card_wrapper_029">
                                <div className="upper_pot_029 position-relative">
                                  <div className="food_img_029">
                                    <img src={product?.photo} alt="" />
                                  </div>
                                  <div className="food_type">
                                    <div
                                      className={
                                        product?.type === "veg"
                                          ? "box veg"
                                          : product?.type === "non veg"
                                          ? "box non"
                                          : "box unkown"
                                      }
                                    >
                                      <div
                                        className={
                                          product?.type === "veg"
                                            ? "circle veg"
                                            : product?.type === "non veg"
                                            ? "circle non"
                                            : "circle unkown"
                                        }
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bottom_pot_029">
                                  <h3 className="food_name_029">
                                    {product?.name ?? "N/A"}
                                  </h3>
                                  <p className="food_price__">
                                    {product?.price}
                                  </p>
                                  <p className="food_desc_029">
                                    {product?.description &&
                                      Utils.stripHtml(product?.description)}
                                  </p>
                                  <button
                                    type="button"
                                    className="cart_btn_029"
                                    onClick={() => addOnsModalData(product)}
                                  >
                                    {/* <Bs.BsCart3 /> */}
                                    ADD
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              }
            })}
        </Fragment>
      ) : (
        <SkeltLoader />
      )}
    </Fragment>
  );
}

export default Foodcard;
