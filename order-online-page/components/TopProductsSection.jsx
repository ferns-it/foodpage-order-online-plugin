"use client";
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { Anchor } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FoodSlider.css";
import Image from "next/image";
import { AppContext } from "../context";

const TopProductsSection = () => {
  const {categoryList} =useContext(AppContext);
  const [foodCategories,setFoodCategories] = useState(null);
  useEffect(() =>{
const filteredData = categoryList && categoryList.filter((data)=>data.)
  },[])
  console.log(categoryList,"list")
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2500,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2500,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2500,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2500,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2500,
        },
      },
    ],
  };

  return (
    <div className="container-fluid">
      <div className="food-container">
        <div className="slider-header">
          <h2>
            Muziris Popular Dishes <Anchor size={24} />
          </h2>
        </div>
        <Slider {...settings}>
          {/* {foodCategories &&
            foodCategories.length != 0 &&
            foodCategories.map((category) => (
              <div key={category.id} className="cat-block">
                <div className="food-category-item">
                  <div className="food-image-container">
                    <Image
                      src={category.image}
                      width={200}
                      height={0}
                      alt={category.title}
                      layout="cover"
                      className="food-image"
                    />
                  </div>
                  <div
                    className="food-info"
                    style={{ backgroundColor: category.bgColor }}
                  >
                    <h3>{category.title}</h3>
                    <p>{category.subtitle}</p>
                  </div>
                </div>
              </div>
            ))} */}
        </Slider>
      </div>
    </div>
  );
};

export default TopProductsSection;
