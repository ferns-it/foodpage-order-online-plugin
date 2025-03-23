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
                  <div className="tab-pane fade show active mt-3">
                    <div className="row">
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
                                <div className="food_tile__ active pb-2 mt-2">
                                  <div className="wrapped">
                                    <span className="food_detail">
                                      <Skeleton width={150} />
                                    </span>
                                  </div>
                                  <Skeleton width={150} count={2} />
                                </div>
                                <div className="d-flex h-100 justify-content-center">
                                  <Skeleton width={100} height={100} circle />
                                </div>
                              </div>
                            </div>
                          </div>
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
