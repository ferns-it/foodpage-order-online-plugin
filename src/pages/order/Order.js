import React, { Fragment, useState } from "react";
import * as Md from "react-icons/md";
import * as Pi from "react-icons/pi";

function Order() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [delivery, setDelivey] = useState(false);

  const handleItemClick = (index) => {
    setSelectedItem(index);
  };

  fetch("https://foodpage.co.uk/development/v2/shop/products/1/0")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the JSON data received from the server
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error("Fetch error:", error);
    });

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
  return (
    <Fragment>
      <section className="order-online">
        <div className="container">
          <p className="info-header">
            <i>
              <Pi.PiCallBellFill />
            </i>
            Mild Medium Hot Gluten Milk NUts Vegetarian We can accommodate most
            allergies, if you have any allergies please inform us when ordering.
          </p>
        </div>
      </section>
    </Fragment>
  );
}

export default Order;
