"use client";
import React from "react";
import Slider from "react-slick";
import { Anchor } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FoodSlider.css";
import Image from "next/image";
const foodCategories = [
  {
    id: 1,
    title: "Chicken Biriyani",
    subtitle: "Best-Sellers Dish",
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    bgColor: "#c41e1e",
  },
  {
    id: 2,
    title: "Salads",
    subtitle: "Top Rated Dish",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    bgColor: "#c41e1e",
  },
  {
    id: 3,
    title: "Pasta & Casuals",
    subtitle: "Muziris Signature",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    bgColor: "#c41e1e",
  },
  {
    id: 4,
    title: "Pizza",
    subtitle: "Popular Picks",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    bgColor: "#c41e1e",
  },
  {
    id: 5,
    title: "Breakfast",
    subtitle: "Chef's Special",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    bgColor: "#c41e1e",
  },
  {
    id: 6,
    title: "Soups",
    subtitle: "Must-Try Dishes",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    bgColor: "#c41e1e",
  },
];
const TopProductsSection = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
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
          {foodCategories.map((category) => (
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
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TopProductsSection;
