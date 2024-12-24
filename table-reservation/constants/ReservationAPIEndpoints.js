"use client";
const id = process.env.SHOP_ID;
const shopId = `${id}-shop`;
const shopURL = process.env.SHOP_URL;

export const ReservationAPIEndpoints = {
  sendReservationOTP: "user/diningtable/reservation/sendotp",
  shopTiming: "timing",
  newReservation: "user/diningtable/reservation/new",
  fetchReservationDetails: "user/diningtable/reservation/view",
  cancelReservation: "user/diningtable/reservation/cancel",
  updateReservation: "user/diningtable/reservation/update",
  sendMessageToShop: "user/diningtable/reservation/sendmailtoshop",
  getUpcomingHolidays: `user/diningtable/reservation/upcomingholidays/${shopId}`,
};
