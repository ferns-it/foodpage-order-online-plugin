import React, { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import AddOnsModal from "./AddOnsModal";
import * as Pi from "react-icons/pi";
import "react-loading-skeleton/dist/skeleton.css";
import FoodCardsSkeleton from "./FoodCardsSkeleton";
import { useSearchParams } from "next/navigation";
import { getSessionStorageItem } from "../../_utils/ClientUtils";
import "../../guest-login/style.css";
import Image from "next/image";

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
      {/* <div className="container position-relative">
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
      </div> */}

      {settingsLoading == false &&
        currentStatus != null &&
        currentStatus?.status == true && (
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
              productsList.length != 0 &&
              productsList.map((list, catIndex) => {
                if (list?.categoryName == category.category) {
                  const products = list?.products;
                  return (
                    <div className="tab-content" key={catIndex}>
                      <h6 className="cat_name__ ">
                        {list?.categoryName ?? "N/A"}
                      </h6>
                      <br />
                      <div className="tab-pane fade show active mt-3">
                        <div className="row">
                          {products && products.length != 0 ? (
                            products?.map((data, index) => {
                              const isImg =
                                data?.photo !=
                                "https://development.foodpage.co.uk/theme/dish_placeholder.png";
                              return (
                                <div
                                  className=" col-lg-12 col-md-12 col-sm-12 position-relative mb-3"
                                  key={index}
                                >
                                  <div id="fda_product_tile">
                                    <div className="row fda_food_row">
                                      <div
                                        className="prod_anchor"
                                        style={{
                                          textDecoration: "none",
                                        }}
                                      >
                                        <div className="cust_row">
                                          {" "}
                                          <div
                                            className="food_tile__ active pb-2 mt-2"
                                            id={isImg === false ? "new_dish_wrap" : ""}
                                          >
                                            <div className="wrapped">
                                              <h6 className="dish_name">
                                                {data?.name}
                                              </h6>
                                              <span className="food_detail">
                                                {stripHtml(
                                                  data?.description ?? "N/A"
                                                )}
                                              </span>
                                            </div>
                                            <div className="online-card">
                                              <h4 className="dish-value">
                                                {" "}
                                                <b>{data?.price ?? "N/A"}</b>
                                              </h4>

                                              <button
                                                type="button"
                                                className="dish-btn"
                                                onClick={() =>
                                                  handleModal(data)
                                                }
                                              >
                                                Add to cart
                                              </button>
                                            </div>
                                          </div>{" "}
                                          {isImg && (
                                            <>
                                              <div className="food_img_wrapper_">
                                                <Image
                                                  // layout="responsive"
                                                  src={data?.photo}
                                                  width={100}
                                                  height={100}
                                                  alt=""
                                                  className="image-online "
                                                  referrerPolicy="no-referrer"
                                                />
                                              </div>
                                            </>
                                          )}
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
