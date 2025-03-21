"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import "../style/order-online-style.css";
import FoodCards from "../components/FoodCards";
import OrderSummary from "../components/OrderSummary";
import FoodAccordian from "../components/FoodAccordian";
import { useRouter } from "next/navigation";
import LoaderComp from "../components/LoaderComp";
import { TableReservationContext } from "../../table-reservation/context/TableReservationContext";
import "../../table-reservation/style/style.css";
import "../style/order-online-style.css";
import { ImSpoonKnife } from "react-icons/im";
import { BiFoodMenu } from "react-icons/bi";
import Image from "next/image";
import OnlineBanner from "../../../../../public/Assets/orde-ban.png";
import "swiper/css";
import "swiper/css/navigation";
import Foodorder from "../../../../../public/Assets/order-food.png";
import TrackOrder from "../../../../../public/Assets/track.png";
import Delivery from "../../../../../public/Assets/del.png";
import BannerCont from "../../../../../public/Assets/order-fd.png";
import AppStore from "../../../../../public/Assets/appstore.png";
import PlayStore from "../../../../../public/Assets/playstore.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const testimonials = [
  { name: "Arakkal Abu", img: "/Assets/testimonials/user1.jpg" },
  { name: "Aadu Thoma", img: "/Assets/testimonials/user2.jpg" },
  { name: "Sanoj Kottarathil", img: "/Assets/testimonials/user3.jpg" },
  {
    name: "Vadakkan Veetil Koch kunj",
    img: "/Assets/testimonials/user4.jpg",
  },
  { name: "Kolapulli Leela", img: "/Assets/testimonials/user5.jpg" },
];

const PrevArrow = ({ onClick }) => (
  <button className="custom-prev" onClick={onClick}>
    <FaChevronLeft size={14} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button className="custom-next" onClick={onClick}>
    <FaChevronRight size={14} />
  </button>
);

const OrderOnlineMain = () => {
  const router = useRouter();
  const {
    categoryList,
    productsList,
    fetchSingleProduct,
    categoryLoading,
    settings,
    settingsLoading,
    menuLoading,
  } = useContext(AppContext);
  const [activeChipIndex, setActiveChipIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [activeSliderIndex, setActiveSliderIndex] = useState(0);

  useEffect(() => {
    if (!categoryList) return;
    const catName = categoryList[0]?.name;
    setSelectedCategory(catName);
    setActiveChipIndex(0);
  }, [categoryList]);

  // useEffect(() => {
  //   if (!shopId) return;
  //   getShopTiming(shopId);
  // }, [shopId]);

  var sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default for large screens
    slidesToScroll: 1,
    autoplay: true,
    loop: true,
    arrows: true,
    centerMode: true,
    afterChange: (current) => setActiveSliderIndex(current),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: true,
          centerMode: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: true,
          centerMode: false,
        },
      },
    ],
  };

  const handleChipClick = async (index, catName, cID) => {
    setActiveChipIndex(index);
    setSelectedCategory(catName);

    const isCheck =
      productsList &&
      productsList.length != 0 &&
      productsList.some((x) => x.cID == cID);
    if (!isCheck) {
      await fetchSingleProduct(cID);
    }
  };

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

  function stripHtml(html) {
    const temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  // const title = settings && settings?.themeTitle ? JSON.parse(settings?.themeTitle) : "";

  return (
    <Fragment>
      {!settingsLoading ? (
        <Fragment>
          <br />
          <div className="food_order_area mt-4">
            <div className="order_block">
              <div className="row">
                <div className="col-lg-3 col-md-12 col-sm-none cat_col_0229">
                  <div className="card category_card_009">
                    <ul className="food_category_009">
                      {categoryLoading ? (
                        <Fragment>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                          <h2 className="card-title-order-online-920 skeleton"></h2>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div className="nav-link-static">
                            <ImSpoonKnife size={30} /> <BiFoodMenu size={30} />{" "}
                            <b>Menu</b>
                          </div>
                          {categoryList &&
                            categoryList.length > 0 &&
                            categoryList.map((list, index) => {
                              const children = list?.childrens;

                              if (children && children.length > 0) {
                                const hasValidChildren = children.some(
                                  (child) => child.productsCount?.online > 0
                                );

                                if (hasValidChildren) {
                                  return (
                                    <a
                                      key={index}
                                      className={
                                        index === activeChipIndex
                                          ? "nav-link active_009"
                                          : "nav-link"
                                      }
                                      onClick={() =>
                                        handleChipClick(
                                          index,
                                          list?.name,
                                          list?.cID
                                        )
                                      }
                                    >
                                      <li>{list?.name}</li>
                                      <i>{/* Optional icon */}</i>
                                    </a>
                                  );
                                }
                              } else if (list.productsCount?.online > 0) {
                                return (
                                  <a
                                    key={index}
                                    className={
                                      index === activeChipIndex
                                        ? "nav-link active_009"
                                        : "nav-link"
                                    }
                                    onClick={() =>
                                      handleChipClick(
                                        index,
                                        list?.name,
                                        list?.cID
                                      )
                                    }
                                  >
                                    <li>{list?.name}</li>
                                    <i>{/* Optional icon */}</i>
                                  </a>
                                );
                              }

                              return null;
                            })}
                        </Fragment>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-9 col-md-12 col-sm-12">
                  <section className="foodmenuList">
                    <FoodCards category={selectedCategory} />
                    <FoodAccordian />
                  </section>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 col-sm-12 card mt-3 mb-3">
                  <div className="p-3">
                    <Image
                      src={OnlineBanner}
                      width={0}
                      height={270}
                      layout="responsive"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="billing_area position-relative">
              <div
                className={
                  isSticky
                    ? "billing_block_order_plugin sticky bill-spikes"
                    : "billing_block_order_plugin bill-spikes"
                }
                // className="billing_block_order_plugin bill-spikes"
              >
                <OrderSummary />
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <LoaderComp />
      )}
      <Fragment>
        <div className="Order-online-Section"></div>
        <div className="order-banner">
          <div className="sec-container">
            {" "}
            <h1 className="head-order">How Does Muziris.uk Work</h1>
            <div className="row ">
              {/* Left Side - Order Steps */}
              <div className="col-md-7">
                <div className="row">
                  {/* Order Step 1 */}
                  <div className="col-md-4 col-sm-6">
                    <div className="order-online-bg">
                      <h6 className="head-one">Place an Order!</h6>
                      <Image
                        src={Foodorder}
                        alt="food-order"
                        width={80}
                        height={80}
                      />
                      <p className="text-center banner-cont-online">
                        Place order through our website or Mobile app
                      </p>
                    </div>
                  </div>
                  {/* Order Step 2 */}
                  <div className="col-md-4 col-sm-6">
                    <div className="order-online-bg">
                      <h6 className="head-one">Track Progress</h6>
                      <Image
                        src={TrackOrder}
                        alt="track-order"
                        width={80}
                        height={80}
                      />
                      <p className="text-center banner-cont-online">
                        You can track your order status with delivery time
                      </p>
                    </div>
                  </div>
                  {/* Order Step 3 */}
                  <div className="col-md-4 col-sm-6">
                    <div className="order-online-bg">
                      <h6 className="head-one">Get your Order!</h6>
                      <Image
                        src={Delivery}
                        alt="delivery"
                        width={80}
                        height={80}
                      />
                      <p className="text-center banner-cont-online">
                        Receive your order at a lightning-fast speed!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Text and Image */}
              <div className="col-md-5 text-center text-md-start">
                <div className="order-heading">
                  <h1 className="sec1-head">
                    Ordering is more <br />
                  </h1>
                </div>
                <div className="span-for-online">
                  <div className="inside-cont">
                    {" "}
                    <span className="highlighted-text">Personalised</span> &
                    Instant
                  </div>
                  <div></div>
                </div>

                <div className="row">
                  <div className="col-md-5 col-sm-12">
                    <Image
                      src={BannerCont}
                      alt="Couple looking at phone"
                      width={350}
                      height={0}
                      className="ban-img-order"
                    />
                  </div>
                  <div className="col-md-7 col-sm-12">
                    <h6 className="order-desc">
                      Download the Muziris app for faster ordering
                    </h6>
                    <div className="app-buttons">
                      <button className="btn-ad-cont">
                        {" "}
                        <Image
                          src={AppStore}
                          alt="Google Play"
                          width={170}
                          height={0}
                        />
                      </button>{" "}
                      <button className="btn-ad-cont">
                        <Image
                          src={PlayStore}
                          alt="Google Play"
                          width={170}
                          height={0}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
      <Fragment>
        <div className="bg_section_new">
          <div className="container-fluid p-0 m-0 bg-last-order-online">
            <div className="col-md-8 col-sm-12 mx-auto text-center">
              <div className="content-order-online">
                <h4>Peoples's Talk</h4>
                <h6>WHAT CUSTOMER SAY ABOUT US</h6>
                <br />
                <p className="online_adsss">
                  The food(Onam Sadhya) we ordered from Muzris was very tasty.
                  It was for around 65 people in Brentwood and the review we got
                  from everyone was very good.. We'll done Sal.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="relative w-full max-w-xl">
                  {/* <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={3} 
                    navigation
                    loop
                    autoplay={true}
                  >
                    {testimonials.map((item, index) => (
                      <SwiperSlide key={index} className="flex justify-center">
                        <div
                          className={`${
                            index === 2
                              ? "scale-125 border-yellow-500"
                              : "opacity-50"
                          }`}
                        >
                          <Image
                            width={100}
                            height={100}
                            src={item.img}
                            alt={item.name}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper> */}
                  <div className="slider_outer_wrap position-relative">
                    <Slider {...sliderSettings}>
                      {testimonials &&
                        testimonials.length != 0 &&
                        testimonials.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className={`d-flex align-items-center justify-content-center transition-all duration-300 ${
                                index === activeSliderIndex
                                  ? "opacity-100"
                                  : "opacity-50"
                              }`}
                            >
                              <div className="slider_wrapper_new ">
                                <Image
                                  width={100}
                                  height={100}
                                  src={item.img}
                                  alt={item.name}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </Slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </Fragment>
  );
};

export default OrderOnlineMain;
