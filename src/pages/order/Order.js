import React, { Fragment, useContext, useEffect, useState } from "react";
import * as Md from "react-icons/md";
import * as Pi from "react-icons/pi";
import { AppContext } from "../../context/AppContext";

function Order() {
  const { menuList, menuLoading } = useContext(AppContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [delivery, setDelivey] = useState(false);
  const [filteredList, setFilteredList] = useState(null);

  useEffect(() => {
    if (!menuList) return;

    const data =
      menuList?.items &&
      Array.isArray(menuList?.items) &&
      menuList?.items.filter((item) => {
        if (item?.isAvailable === true) return item;
      });

    setFilteredList(data);
  }, [menuList]);

  console.log("filteredList", filteredList);

  const handleItemClick = (index) => {
    setSelectedItem(index);
  };

  // fetch("https://foodpage.co.uk/development/v2/shop/products/1/0")
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     // Handle the JSON data received from the server
  //     console.log(data);
  //   })
  //   .catch((error) => {
  //     // Handle any errors that occurred during the fetch
  //     console.error("Fetch error:", error);
  //   });

  const handleKeyPress = (event) => {
    // Prevent input of negative symbol (-) if pressed
    if (event.key === "-" || event.key === "e") {
      event.preventDefault();
    }
  };
  const menuItems = [
    "PIZZA",
    "ITALIAN PASTA",
    "PIZZA & PASTA DEAL",
    "SALADS",
    "BURGERS",
    "BURGER MEALS",
    "STARTERS & SIDE DISHES",
    "DRINKS",
    "DESSERTS",
    "ICE CREAM",
    "SPECIAL OFFERS",
  ];
  const moveLeft = () => {};

  const moveRight = () => {};
  return (
    <Fragment>
      <section className="order-online">
        <div className="container position-relative">
          <p className="info-header">
            <i>
              <Pi.PiCallBellFill />
            </i>
            Mild Medium Hot Gluten Milk NUts Vegetarian We can accommodate most
            allergies, if you have any allergies please inform us when ordering.
          </p>

          <div className="chip-container mt-4 d-flex">
            <button onClick={moveLeft}>&lt;</button>
            <ul className="menu-list ">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                </li>
              ))}
            </ul>
            <button onClick={moveRight}>&gt;</button>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Order;
