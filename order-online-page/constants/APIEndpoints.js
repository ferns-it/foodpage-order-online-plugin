"use client";

const id = 1;
const shopId = `${id}-shop`;
const shopURL = "le-arabia";

export const APIEndpoints = {
  menulist: `products/${id}/0`,
  categoryList: `categories/${shopId}`,
  cartCreation: "user/web/carts",
  getCartItems: "user/web/carts",
  deleteCartItem: "user/web/carts",
  clearCart: "user/web/carts/clear",
  productList: "products",
  shopSettings: `settings/${shopURL}`,
  diningMenu: `products/${id}/0/dining`,
  createPaymentIntent: "user/web/checkout/createpaymentintent",
  locationSettings: "service",
  completecheckout: "user/web/checkout/complete",
  sendOTP: "user/verificationotpmail",
  userLogin: "user/login",
  resetPassword: "user/resetpassword",
  registerUser: "user/registration",
  passwordResetOTP: "user/passwordresetotp",
  updateCartItem: "user/web/carts/transfer",
  getAddressList: "user/addresslist",
  addAddress: "user/newaddress",
  deleteAddressList: "user/deleteaddress",
  getOrderList: `user/orderhistory/${id}`,
  getOrderDetails: "order/details",
  getDefaultAddress: "user/setdefaultaddress",
  getDiscountForGuest: "guest/checkout/takeawaycalculator",
  getDeliveryDiscountGuest: "guest/checkout/deliverycalculator",
  getCurrentShopStatus:`status/${id}`
};
