import React, { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import AddOnsModal from "./AddOnsModal";
import * as Pi from "react-icons/pi";
import "react-loading-skeleton/dist/skeleton.css";
import FoodCardsSkeleton from "./FoodCardsSkeleton";
import { getSessionStorageItem } from "../../_utils/ClientUtils";

function FoodCards(category) {
  const {
    productsList,
    productsListLoading,
    settings,
    showModal,
    setShowModal,
    settingsLoading,
    currentStatus,
  } = useContext(AppContext);

  const [productDataValues, setProductDataValues] = useState(null);

  function getQueryParam(param) {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }
    return null;
  }

  function stripHtml(html) {
    const temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  useEffect(() => {
    const showModal = getQueryParam("addOnModal");

    if (showModal) {
      const data = getSessionStorageItem("selectedProduct");
      console.log(data, "data");
      if (data && data.length !== 0) {
        const product = JSON.parse(data);
        setShowModal(true);
        setProductDataValues(product);
      }
    }
  }, []); // Empty dependency array to run this effect once on component mount

  const handleModal = (data) => {
    setShowModal(true);
    setProductDataValues(data);
  };

  return (
    <Fragment>
      <AddOnsModal
        showModal={showModal}
        setShowModal={setShowModal}
        productData={productDataValues}
      />
      {settingsLoading === false &&
        currentStatus != null &&
        currentStatus?.status === true && (
          <p className="info-header">
            <i>
              <Pi.PiCallBellFill />
            </i>
            {currentStatus?.message ??
              "Sorry, We're Temporarily Closed! Be Back Soon."}
          </p>
        )}

      <div className="product_wrapper_029">
        {productsListLoading ? (
          <FoodCardsSkeleton />
        ) : (
          <Fragment>
            {productsList &&
              Array.isArray(productsList) &&
              productsList.length !== 0 &&
              productsList.map((list, catIndex) => {
                if (list?.categoryName === category.category) {
                  const products = list?.products;
                  return (
                    <div className="tab-content" key={catIndex}>
                      <h6 className="cat_name__ text-center">
                        {list?.categoryName ?? "N/A"}
                      </h6>
                      <br />
                      <div className="tab-pane fade show active mt-3">
                        <div className="row">
                          {products && products.length !== 0 ? (
                            products.map((data, index) => {
                              return (
                                <div
                                  className="col-lg-4 col-md-2 col-sm-6 position-relative mb-3"
                                  key={index}
                                >
                                  <div
                                    id="fda_product_tile"
                                    style={{
                                      background:
                                        "linear-gradient(180deg, rgba(238, 238, 238, 1) 0%, rgba(0, 0, 0, 0) 100%)",
                                    }}
                                  >
                                    <div className="row fda_food_row">
                                      <div className="mx-auto">
                                        <div
                                          className="prod_anchor"
                                          style={{ textDecoration: "none" }}
                                        >
                                          <div className="food_tile__ active mb-4 p-3">
                                            <h6 className="dish_name">
                                              {data?.name}
                                            </h6>
                                            <span className="food_detail">
                                              {stripHtml(
                                                data?.description ?? "N/A"
                                              )}
                                            </span>

                                            <h4 className="prod_price">
                                              <b>{data?.price ?? "N/A"}</b>
                                            </h4>

                                            <button
                                              type="button"
                                              className="add_to_cart"
                                              onClick={() => handleModal(data)}
                                            >
                                              ADD
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <Fragment>
                              <h3 className="products_placeholder">
                                No items available.
                              </h3>
                            </Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default FoodCards;
