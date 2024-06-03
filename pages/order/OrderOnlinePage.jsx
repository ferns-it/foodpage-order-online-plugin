import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import * as Md from "react-icons/md";
import * as Pi from "react-icons/pi";
import { MdOutlineClose } from "react-icons/md";
import * as Fa from "react-icons/fa";
import * as Ti from "react-icons/ti";
import * as Lu from "react-icons/lu";
import { OrderOnlineContext } from "../../context/OrderOnlineContext";
import Foodcard from "../../components/Foodcard";
import FoodAccordian from "../../components/FoodAccordian";
import OrderSummary from "../../components/OrderSummary";
import { useParams } from "react-router-dom";
import "../../style/OrderOnlineApp.css";
import toast from "react-hot-toast";
import PageLoader from "../../components/PageLoader";

function OrderOnlinePage() {
  const { shopId, shopUrl } = useParams();

  const {
    menuList,
    settings,
    categoryList,
    setParamsValues,
    setIsPageLoading,
    isPageLoading,
    filterLoading,
    menuLoading,
    cartLoading,
    fetchCategoriesList,
  } = useContext(OrderOnlineContext);
  const [filteredList, setFilteredList] = useState(null);
  const [activeChipIndex, setActiveChipIndex] = useState(-1);
  const [activeSmallScreen, setActiveSmallScreen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (!shopId || !shopUrl) return;
    // setParamsValues({ shopId, shopUrl });
    fetchCategoriesList(shopId);
  }, []);

  useEffect(() => {
    if (
      filterLoading === true ||
      menuLoading === true ||
      cartLoading === true
    ) {
      setIsPageLoading(true);
      return;
    }
    setIsPageLoading(false);
  }, [filterLoading, menuLoading, cartLoading]);

  // useEffect(() => {
  //   if (!responseError) return;
  //   if (responseError?.code === "ECONNABORTED") {
  //     window.location.reload();
  //   }
  // }, [responseError]);

  const handleScroll = () => {
    if (window.pageYOffset >= 100) {
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

  useEffect(() => {
    if (!menuList) return;

    const data =
      menuList?.items &&
      Array.isArray(menuList?.items) &&
      menuList?.items.filter((item) => {
        if (item?.isAvailable === true) return item;
      });

    setFilteredList(data);
  }, [menuList, categoryList]);

  const handleChipClick = (index, catName) => {
    setActiveChipIndex(index);
    setSelectedCategory(catName);
  };

  return (
    <Fragment>
      <section className="order-online">
        <div className="container position-relative">
          {settings?.shopStatus == "close" && (
            <p className="info-header">
              <i>
                <Pi.PiCallBellFill />
              </i>
              Sorry We're Temporarily Closed! Be Back Soon.
            </p>
          )}
        </div>

        <div className="wrapper_102322">
          <div className="container-fluid">
            {menuLoading && cartLoading ? (
              <div className="loader_foodpage_online_order">
                <div className="loader_gif">
                  <PageLoader />
                </div>
              </div>
            ) : (
              <div className="food_order_area">
                <div className="order_block">
                  <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-none cat_col_0229">
                      <div className="card category_card_009 p-2">
                        <ul className="food_category_009">
                          <a
                            className={
                              activeChipIndex === -1
                                ? "nav-link active_009"
                                : "nav-link"
                            }
                            onClick={() => {
                              setActiveChipIndex(-1);
                              setSelectedCategory("All");
                            }}
                          >
                            <li>All</li>
                            <i>
                              <Lu.LuArrowRightToLine />
                            </i>
                          </a>
                          {categoryList &&
                            categoryList.length != 0 &&
                            categoryList.map((list, index) => {
                              return (
                                <a
                                  // href={`#category-${index}`}
                                  className={
                                    index === activeChipIndex
                                      ? "nav-link active_009"
                                      : "nav-link"
                                  }
                                  key={index}
                                  onClick={() =>
                                    handleChipClick(index, list?.name)
                                  }
                                >
                                  <li>{list?.name}</li>
                                  <i>
                                    <Lu.LuArrowRightToLine />
                                  </i>
                                </a>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12 food_area_col">
                      <Foodcard category={selectedCategory} />

                      <FoodAccordian />
                    </div>
                  </div>
                </div>
                {/* <div className="checkout_responsive_area">
                <div className="container">
                  <div className="row">
                    <div className="col-10">
                      <button
                        className="checkout_resp_btn_021"
                        onClick={() => setActiveSmallScreen(!activeSmallScreen)}
                      >
                        Order Summary
                      </button>
                      {activeSmallScreen && (
                        <>
                          <div className="check-res p-3">
                            <button
                              className="tog"
                              onClick={() => setActiveSmallScreen(false)}
                            >
                              <MdOutlineClose />
                            </button>
                            <OrderSummary />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div> */}
                <div
                  className={
                    isSticky
                      ? "billing_block_order_plugin sticky bill-spikes"
                      : "billing_block_order_plugin bill-spikes"
                  }
                >
                  <OrderSummary />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="footer_98_"></div>
      </section>
    </Fragment>
  );
}

export default OrderOnlinePage;
