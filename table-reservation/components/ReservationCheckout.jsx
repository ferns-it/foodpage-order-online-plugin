import React from "react";

function ReservationCheckout() {
  // Sample reservation data (in a real app, this would come from a database or state)
  const reservationData = {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    date: "2025-06-15",
    time: "19:00",
    guests: 4,
    specialRequests: "Window table preferred. Celebrating an anniversary.",
    restaurantName: "The Grand Bistro",
    restaurantAddress: "123 Culinary Avenue, Foodville",
    reservationId: "RES-7821-9384",
    price: 25.0, // Deposit amount
    tax: 2.5,
    total: 27.5,
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // State for checkout form
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    agreeToTerms: false,
  });

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    alert("Payment successful! Your reservation is now confirmed.");
  };

  return (
    <div className="checkout7821_page">
      <div className="checkout7821_container">
        <div className="checkout7821_header">
          <h1>Complete Your Reservation</h1>
          <p>Review details and confirm with payment</p>
        </div>

        <div className="checkout7821_confirmation_banner">
          <div className="checkout7821_confirmation_icon">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div>
            <p className="checkout7821_confirmation_id">
              Reservation #{reservationData.reservationId}
            </p>
            <p className="checkout7821_confirmation_text">
              Please review your details and complete payment to confirm
            </p>
          </div>
        </div>

        <div className="checkout7821_details_section">
          <div className="checkout7821_section_title">
            <Calendar className="checkout7821_section_icon" />
            <h2>Reservation Details</h2>
          </div>

          <div className="checkout7821_details_grid">
            <div className="checkout7821_restaurant_info">
              <h3>
                <Utensils className="checkout7821_info_title_icon" />
                Restaurant Information
              </h3>

              <div className="checkout7821_info_item">
                <div className="checkout7821_info_icon">
                  <Utensils />
                </div>
                <div>
                  <p className="checkout7821_info_value">
                    {reservationData.restaurantName}
                  </p>
                </div>
              </div>

              <div className="checkout7821_info_item">
                <div className="checkout7821_info_icon">
                  <MapPin />
                </div>
                <div>
                  <p>{reservationData.restaurantAddress}</p>
                </div>
              </div>

              <div className="checkout7821_info_item">
                <div className="checkout7821_info_icon">
                  <Phone />
                </div>
                <div>
                  <p>(555) 987-6543</p>
                </div>
              </div>
            </div>

            <div className="checkout7821_reservation_info">
              <h3>
                <Calendar className="checkout7821_info_title_icon" />
                Your Reservation
              </h3>

              <div className="checkout7821_info_item">
                <div className="checkout7821_info_icon">
                  <Calendar />
                </div>
                <div>
                  <p className="checkout7821_info_label">Date</p>
                  <p className="checkout7821_info_value">
                    {formatDate(reservationData.date)}
                  </p>
                </div>
              </div>

              <div className="checkout7821_info_item">
                <div className="checkout7821_info_icon">
                  <Clock />
                </div>
                <div>
                  <p className="checkout7821_info_label">Time</p>
                  <p className="checkout7821_info_value">
                    {reservationData.time === "19:00"
                      ? "7:00 PM"
                      : reservationData.time}
                  </p>
                </div>
              </div>

              <div className="checkout7821_info_item">
                <div className="checkout7821_info_icon">
                  <Users />
                </div>
                <div>
                  <p className="checkout7821_info_label">Party Size</p>
                  <p className="checkout7821_info_value">
                    {reservationData.guests}{" "}
                    {reservationData.guests === 1 ? "person" : "people"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="checkout7821_guest_info">
            <h3>
              <Users className="checkout7821_info_title_icon" />
              Guest Information
            </h3>

            <div className="checkout7821_info_grid">
              <div className="checkout7821_info_item">
                <div className="checkout7821_info_icon">
                  <Users />
                </div>
                <div>
                  <p className="checkout7821_info_label">Name</p>
                  <p className="checkout7821_info_value">
                    {reservationData.name}
                  </p>
                </div>
              </div>

              <div className="checkout7821_info_item">
                <div className="checkout7821_info_icon">
                  <Phone />
                </div>
                <div>
                  <p className="checkout7821_info_label">Phone</p>
                  <p className="checkout7821_info_value">
                    {reservationData.phone}
                  </p>
                </div>
              </div>

              <div className="checkout7821_info_item">
                <div className="checkout7821_info_icon">
                  <Mail />
                </div>
                <div>
                  <p className="checkout7821_info_label">Email</p>
                  <p className="checkout7821_info_value">
                    {reservationData.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {reservationData.specialRequests && (
            <div className="checkout7821_special_requests">
              <h3>
                <Info className="checkout7821_info_title_icon" />
                Special Requests
              </h3>
              <p>{reservationData.specialRequests}</p>
            </div>
          )}

          {/* Checkout Form Section */}
          <div className="checkout7821_payment_section">
            <div className="checkout7821_section_title">
              <CreditCard className="checkout7821_section_icon" />
              <h2>Payment Details</h2>
            </div>

            <div className="checkout7821_payment_summary">
              <h3>
                <DollarSign className="checkout7821_info_title_icon" />
                Reservation Summary
              </h3>

              <div className="checkout7821_summary_grid">
                <div className="checkout7821_summary_label">
                  Reservation Deposit:
                </div>
                <div className="checkout7821_summary_value">
                  ${reservationData.price.toFixed(2)}
                </div>
                <div className="checkout7821_summary_label">Tax:</div>
                <div className="checkout7821_summary_value">
                  ${reservationData.tax.toFixed(2)}
                </div>
              </div>

              <div className="checkout7821_total_row">
                <div className="checkout7821_total_label">Total:</div>
                <div className="checkout7821_total_value">
                  ${reservationData.total.toFixed(2)}
                </div>
              </div>

              <div className="checkout7821_deposit_note">
                <p>
                  This deposit secures your reservation and will be applied to
                  your final bill.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleCheckout}
              className="checkout7821_payment_form"
            >
              <div className="checkout7821_form_grid">
                <div className="checkout7821_form_group9290 checkout7821_full_width">
                  <label htmlFor="cardNumber" className="checkout7821_label">
                    Card Number
                  </label>
                  <div className="checkout7821_input_icon">
                    <CreditCard className="checkout7821_icon" />
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      className="checkout7821_input"
                      required
                    />
                  </div>
                </div>

                <div className="checkout7821_form_group9291 checkout7821_full_width">
                  <label htmlFor="cardName" className="checkout7821_label">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentChange}
                    className="checkout7821_input"
                    required
                  />
                </div>

                <div className="checkout7821_form_group9292">
                  <label htmlFor="expiry" className="checkout7821_label">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    value={paymentInfo.expiry}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    className="checkout7821_input"
                    required
                  />
                </div>

                <div className="checkout7821_form_group9293">
                  <label htmlFor="cvv" className="checkout7821_label">
                    CVV
                  </label>
                  <div className="checkout7821_input_icon">
                    <Lock className="checkout7821_icon" />
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      className="checkout7821_input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="checkout7821_form_group9294">
                <div className="checkout7821_checkbox_container">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={paymentInfo.agreeToTerms}
                    onChange={handlePaymentChange}
                    className="checkout7821_checkbox"
                    required
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="checkout7821_checkbox_label"
                  >
                    I agree to the cancellation policy and understand that this
                    deposit will be applied to my final bill.
                  </label>
                </div>
              </div>

              <div className="checkout7821_security_note">
                <Lock className="checkout7821_security_icon" />
                <p>Your payment information is encrypted and secure.</p>
              </div>

              <div className="checkout7821_button_container">
                <button type="button" className="checkout7821_back_button">
                  Modify Reservation
                </button>
                <button type="submit" className="checkout7821_submit_button">
                  <Lock className="checkout7821_lock_icon" />
                  Complete Payment
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="checkout7821_footer">
          <p>Please arrive 10 minutes before your reservation time.</p>
          <p>
            For any changes or cancellations, please contact us at least 24
            hours in advance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReservationCheckout;
