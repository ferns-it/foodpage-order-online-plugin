"use client";
import React, { useContext } from "react";
import { AppContext } from "../context";
import { Anchor } from "lucide-react";
import Image from "next/image";

function TopProductsSection() {
  const { categoryList, categoryLoading } = useContext(AppContext);
  const categories = [
    {
      title: "Chicken Biryani",
      subtitle: "Best-Sellers Dish",
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Salads",
      subtitle: "Top Rated Dish",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Pasta & Casuals",
      subtitle: "Muziris Signature Dishes",
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Pizza",
      subtitle: "Popular Picks",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Breakfast",
      subtitle: "Chef's Recommendations",
      image:
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "Soups",
      subtitle: "Must-Try Dishes",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];
  console.log(categoryList, "listsl");
  return (
    <div>
      <div className="container">
        <div >
          <h1 className="title-slide">
            Muziris Popular Dishes <Anchor size={32} />
          </h1>
        </div>
        <div className="container">
          {categories.map((category, index) => (
            <div className="category-card" key={index}>
              <div className="image-container">
                <div className="wind-full">
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={200}
                    layout="contain"
                    height={200}
                    className="category-image"
                  />
                </div>
              </div>
              <div className="category-info">
                <h2 className="category-title">{category.title}</h2>
                <p className="category-subtitle">{category.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopProductsSection;
