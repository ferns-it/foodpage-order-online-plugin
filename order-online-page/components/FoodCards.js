import React, { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import AddOnsModal from "./AddOnsModal";
import * as Pi from "react-icons/pi";
import "react-loading-skeleton/dist/skeleton.css";
import FoodCardsSkeleton from "./FoodCardsSkeleton";
import { useSearchParams } from "next/navigation";
import { getSessionStorageItem } from "@/src/app/_utils/ClientUtils";
import "../../guest-login/style.css";

function FoodCards(category) {
  const {
    productsList,
    productsListLoading,
    settings,
    showModal,
    setShowModal,
  } = useContext(AppContext);

  const params = useSearchParams();

  const [productDataValues, setProductDataValues] = useState(null);

  function stripHtml(html) {
    const temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  useEffect(() => {
    const showModal = params.get("addOnModal");

    if (showModal) {
      const data = getSessionStorageItem("selectedProduct");

      window.sessionStorage.removeItem("selectedProduct");
      if (data && data.length != 0) {
        const product = JSON.parse(data);
        setShowModal(true);
        setProductDataValues(product);
      }
    }
  }, [params]);

  const handleModal = (data) => {
    // debugger;
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
      <div className="container position-relative">
        {(settings?.shopStatus === "close" ||
          (settings?.deliveryInfo?.takeAway_temp_off === "Yes" &&
            settings?.deliveryInfo?.homeDelivery_temp_off === "Yes")) && (
          <p className="info-header">
            <i>
              <Pi.PiCallBellFill />
            </i>
            Sorry, We're Temporarily Closed! Be Back Soon.
          </p>
        )}
      </div>

      <div className="product_wrapper_029">
        {productsListLoading ? (
          <FoodCardsSkeleton />
        ) : (
          <Fragment>
            {productsList &&
              Array.isArray(productsList) &&
              productsList.length != 0 &&
              productsList.map((list, catIndex) => {
                if (list?.categoryName == category.category) {
                  const products = list?.products;
                  return (
                    <div className="tab-content" key={catIndex}>
                      <h6 className="cat_name__ text-center">
                        {list?.categoryName ?? "N/A"}
                      </h6>
                      <br />
                      <div className="tab-pane fade show active mt-3">
                        <div className="row">
                          {products && products.length != 0 ? (
                            products?.map((data, index) => {
                              return (
                                <div
                                  className=" col-lg-4 col-md-2 col-sm-6 position-relative"
                                  key={index}
                                >
                                  <div id="fda_product_tile">
                                    <div className="row fda_food_row position-relative  mb-3">
                                      <div className="mx-auto">
                                        <a
                                          className="prod_anchor"
                                          style={{
                                            textDecoration: "none",
                                            // cursor: "pointer",
                                          }}
                                          // onClick={() => handleModal(data)}
                                        >
                                          <div className="food_tile__ active mb-4 p-3">
                                            {/* <img
                                              src={data?.photo}
                                              alt=""
                                              className={
                                                data?.online === "No" ||
                                                data?.isAvailable === false ||
                                                data?.availability === false
                                                  ? "fda_product_img fd_card_grayscale"
                                                  : "fda_product_img "
                                              }
                                              referrerPolicy="no-referrer"
                                            /> */}
                                            <h6 className="dish_name">
                                              {data?.name}
                                            </h6>
                                            <span className="food_detail">
                                              {stripHtml(
                                                data?.description ?? "N/A"
                                              )}
                                            </span>

                                            <h4 className="prod_price">
                                              {" "}
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
                                        </a>
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
