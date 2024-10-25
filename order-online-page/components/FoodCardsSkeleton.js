import React, { Fragment } from "react";
import Skeleton from "react-loading-skeleton";

function FoodCardsSkeleton() {
  const items = Array.from({ length: 3 });
  return (
    <Fragment>
      <div className="web-view">
        <div className="tab-content">
          <h6 className="cat_name__ text-center">
            <Skeleton width={100} className="mx-auto" />
          </h6>
          <br />
          <div className="tab-pane fade show active mt-3">
            <div className="row">
              {items.map((_, index) => {
                return (
                  <div className="col-md-6 col-lg-4 col-sm-6" key={index}>
                    <div id="fda_product_tile">
                      <div className="row fda_food_row position-relative">
                        <div className="mx-auto w-100" >
                          <a
                            className="prod_anchor"
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            <div
                              className="food_tile__ active mb-4 p-3"
                              id="skelt_food_card"
                            >
                              <img
                                // src={data?.photo}
                                alt=""
                                className="fda_product_img"
                                style={{ opacity: 0 }}
                              />
                              {/* <div className="skeliton_round">
                                <Skeleton circle height={130} width={130} />
                              </div> */}
                              <h6 className="dish_name">
                                <Skeleton
                                  className="mx-auto"
                                  height={20}
                                  width={100}
                                />
                              </h6>
                              <span className="food_detail">
                                <Skeleton height={100} />
                              </span>

                              <div className="mb-3">
                                <h4 className="prod_price">
                                  <b>
                                    <Skeleton />
                                  </b>
                                </h4>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="mob-view">
        <Skeleton count={4} height={120} />
      </div>
    </Fragment>
  );
}

export default FoodCardsSkeleton;
