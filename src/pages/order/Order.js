import React, { Fragment, useState } from "react";
import * as Md from "react-icons/md";

function Order() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [delivery, setDelivey] = useState(false);

  const handleItemClick = (index) => {
    setSelectedItem(index);
  };

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
      <div className="container">
        <div className="row">
          <div className="order_area">
            <div className="row">
              <div className="col-md-12">
                <div className="closed">
                  <div className="border">
                    Sorry We're Temporarily Closed! Be Back Soon...
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-sm-12">
                <div className="order_list">
                  <ul className="menu">
                    {menuItems.map((item, index) => (
                      <li
                        key={index}
                        className={index === selectedItem ? "active" : ""}
                        onClick={() => handleItemClick(index)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-md-7 col-sm-12 mt-3 ">
                <div className="available_items ">
                  <div className="color_items ">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        <h5>Margherita (cheese & Tomato)</h5>
                        <p>Cheese & Tomato</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-2 col-sm-12">
                        <p className="price">£9.99</p>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <input
                          type="number"
                          placeholder="1"
                          className="qty-in"
                          min="1"
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <select className="order-options">
                          <option>options</option>
                          <option>MED 11" (£9.99)</option>
                          <option>LRG 13" (£12.95)</option>
                          <option>XL 15" (£16.95)</option>
                          <option>XXL 20" (£19.95)</option>
                        </select>
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <div className="btn-add">
                          <Md.MdAdd />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="color_items mt-2">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        <h5>Hawaiian</h5>
                        <p>Ham & Pineapple</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-2 col-sm-12">
                        <p className="price">£9.99</p>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <input
                          type="number"
                          placeholder="1"
                          className="qty-in"
                          min="1"
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <select className="order-options">
                          <option>options</option>
                          <option>MED 11" (£9.99)</option>
                          <option>LRG 13" (£12.95)</option>
                          <option>XL 15" (£16.95)</option>
                          <option>XXL 20" (£19.95)</option>
                        </select>
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <div className="btn-add">
                          <Md.MdAdd />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="color_items mt-2">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        <h5>Ham & Mushroom</h5>
                        {/* <p>Cheese & Tomato</p> */}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-2 col-sm-12">
                        <p className="price">£9.99</p>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <input
                          type="number"
                          placeholder="1"
                          className="qty-in"
                          min="1"
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <select className="order-options">
                          <option>options</option>
                          <option>MED 11" (£9.99)</option>
                          <option>LRG 13" (£12.95)</option>
                          <option>XL 15" (£16.95)</option>
                          <option>XXL 20" (£19.95)</option>
                        </select>
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <div className="btn-add">
                          <Md.MdAdd />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="color_items mt-2">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        <h5>Chinese</h5>
                        <p>Chinese Chicken, Mushroom & Sweetcorn</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-2 col-sm-12">
                        <p className="price">£9.99</p>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <input
                          type="number"
                          placeholder="1"
                          className="qty-in"
                          min="1"
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <select className="order-options">
                          <option>options</option>
                          <option>MED 11" (£9.99)</option>
                          <option>LRG 13" (£12.95)</option>
                          <option>XL 15" (£16.95)</option>
                          <option>XXL 20" (£19.95)</option>
                        </select>
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <div className="btn-add">
                          <Md.MdAdd />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="color_items mt-2">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        <h5>Chicken Delight</h5>
                        <p>
                          Tandoori, Roast, Chinese, Mexican & Hot Chilli Chicken
                        </p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-2 col-sm-12">
                        <p className="price">£9.99</p>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <input
                          type="number"
                          placeholder="1"
                          className="qty-in"
                          min="1"
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <select className="order-options">
                          <option>options</option>
                          <option>MED 11" (£9.99)</option>
                          <option>LRG 13" (£12.95)</option>
                          <option>XL 15" (£16.95)</option>
                          <option>XXL 20" (£19.95)</option>
                        </select>
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <div className="btn-add">
                          <Md.MdAdd />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="color_items mt-2">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        <h5> American Hot</h5>
                        <p>Pepperoni, Onion, Green Pepper</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-2 col-sm-12">
                        <p className="price">£9.99</p>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <input
                          type="number"
                          placeholder="1"
                          className="qty-in"
                          min="1"
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <select className="order-options">
                          <option>options</option>
                          <option>MED 11" (£9.99)</option>
                          <option>LRG 13" (£12.95)</option>
                          <option>XL 15" (£16.95)</option>
                          <option>XXL 20" (£19.95)</option>
                        </select>
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <div className="btn-add">
                          <Md.MdAdd />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="color_items mt-2">
                    <div className="row">
                      <div className="col-md-12 col-sm-12">
                        <h5>Meat Treat</h5>
                        <p>Pepperoni, Beet, Ham & Spicy Pork</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-2 col-sm-12">
                        <p className="price">£9.99</p>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <input
                          type="number"
                          placeholder="1"
                          className="qty-in"
                          min="1"
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <select className="order-options">
                          <option>options</option>
                          <option>MED 11" (£9.99)</option>
                          <option>LRG 13" (£12.95)</option>
                          <option>XL 15" (£16.95)</option>
                          <option>XXL 20" (£19.95)</option>
                        </select>
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <div className="btn-add">
                          <Md.MdAdd />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-12 mt-3">
                <div className="order_summary">
                  <div className="summary">
                    <div className="summary_title">
                      <p>Order Summary</p>
                    </div>
                    <div className="row">
                      <div className="col-md-5 col-sm-12">
                        <input
                          type="radio"
                          className="radio_btn"
                          checked={!delivery}
                          onChange={() => setDelivey(false)}
                        />
                        <label className="radio_label">Delivery</label>
                      </div>
                      <div className="col-md-7 col-sm-12">
                        <input
                          type="radio"
                          className="radio_btn"
                          onClick={() => setDelivey(true)}
                          checked={delivery}
                          onChange={() => setDelivey(true)}
                        />
                        <label className="radio_label">Collection</label>
                      </div>
                    </div>
                    <div className="row">
                      {delivery == false ? (
                        <div>
                          <label className="postal_code">Postal Code</label>
                          <input type="text" className="postal_in" />
                        </div>
                      ) : (
                        <div>
                          <label className="postal_code">Pickup Time</label>
                          <input type="time" className="postal_in" />
                        </div>
                      )}
                    </div>

                    <div className="mt-2">
                      <button className="order_btn">Order Now</button>
                    </div>
                    <div className="summary_content">
                      <p>
                        Minimum <strong>£10.00</strong> need to make card
                        payment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Order;
