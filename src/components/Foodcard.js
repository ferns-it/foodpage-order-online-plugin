import React, { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import * as Bs from "react-icons/bs";

function Foodcard() {
  const { categoryList, fetchProductsList } = useContext(AppContext);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    if (!categoryList || categoryList.length === 0) return;

    const fetchData = async () => {
      const pro = await Promise.all(
        categoryList.map(async (item) => {
          const data = {
            shopId: 1,
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
  
  return (
    <Fragment>
      {products &&
        products.length != 0 &&
        products.map((list, key) => {
          const productData = list?.product;
          return (
            <div
              className="product_wrapper_029"
              id={`category-${key}`}
              key={key}
            >
              <h3 className="cat_2901"> {list?.categoryName ?? "N/A"}</h3>
              <br />
              <div className="row">
                {productData &&
                  productData.length != 0 &&
                  productData.map((product, index) => {
                    return (
                      <div className="col-lg-4 col-md-4 col-sm-4" key={index}>
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
                            <p className="food_desc_029">
                              {product?.description ?? "N/A"}
                            </p>
                            <button type="button" className="cart_btn_029">
                              <Bs.BsCart3 /> <span>add cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </Fragment>
  );
}

export default Foodcard;
