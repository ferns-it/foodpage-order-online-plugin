// useEffect(() => {
//   if (!cartItems) return;
//   const cartData = cartItems.cartItems;
//   const initialCounts =
//     cartData && cartData.map((item) => parseInt(item.quantity, 10) || 0);
//   setOrderCounts(initialCounts);
// }, [cartItems]);

// const handleDecreaseOrderSummary = (index) => {
//   setOrderCounts((prevCounts) => {
//     const newCounts = [...prevCounts];
//     if (newCounts[index] > 0) {
//       newCounts[index] -= 1;
//     }
//     return [...newCounts];
//   });
// };

// const handleIncreaseOrderSummary = (index) => {
//   setOrderCounts((prevCounts) => {
//     const newCounts = [...prevCounts];
//     newCounts[index] += 1;
//     return [...newCounts];
//   });
// };

{
  /* <div className="inc_dec_wrapper_order_summary">
                          <button
                            className="summary_qty_btn dec_btn_order_summary"
                            onClick={() => handleDecreaseOrderSummary(index)}
                          >
                            -
                          </button>
                          <span>{orderCounts[index]}</span>
                          <button
                            className="summary_qty_btn inc_btn_order_summary"
                            onClick={() => handleIncreaseOrderSummary(index)}
                          >
                            +
                          </button>
                        </div> */
}

// const isValidRadiusCheck = () => {
//   if (!locationResponse || !settings || !settings.deliveryInfo) return;

//   const deliveryData = settings?.deliveryInfo;
//   if (!deliveryData) return;

//   let distanceType = deliveryData?.distanceType;
//   let freeDelivery = parseInt(deliveryData?.freeDelivery);
//   let freeDeliveryRadius = parseInt(deliveryData?.freeDeliveryRadius);
//   let deliveryChargeType = deliveryData?.deliveryChargeType;
//   let ratePerMile = deliveryData?.ratePerMile;
//   let customerDistance =
//     locationResponse?.rows[0]?.elements[0]?.distance?.value;

//   let km = customerDistance / 1000;
//   let distanceInMiles = km * 0.621371;
//   let roundedDistanceInMiles = parseInt(distanceInMiles.toFixed(2));

//   let freeDeliveryCondition =
//     freeDelivery == 1 && roundedDistanceInMiles < freeDeliveryRadius;

//   if (freeDeliveryCondition === true) {
//     setIsFreeDelivery(true);
//     setDeliveryCharges({ charge: 0, ratePerMile: 0 });
//   } else {
//     setIsFreeDelivery(false);
//   }

//   if (isFreeDelivery == false) {
//     console.log("reached false");
//     const excessDistance = distanceInMiles - freeDeliveryRadius;
//     const deliveryCharge = excessDistance * ratePerMile;
//     setDeliveryCharges({ charge: deliveryCharge.toFixed(2), ratePerMile });
//   }
// };
