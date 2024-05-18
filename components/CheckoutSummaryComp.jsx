import React, { Fragment, useContext, useEffect, useState } from "react";
import { OrderOnlineContext } from "../context/OrderOnlineContext";
import { MdOutlineArrowDownward } from "react-icons/md";

function CheckoutSummaryComp() {
  const {
    cartItems,
    menuList,
    setDeliveryFee,
    type,
    setType,
    settings,
    setAmount,
  } = useContext(OrderOnlineContext);

  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [takeaway, setTakeaway] = useState(null);
  const [allTotal, setAllTotal] = useState(null);
  const [takeawayTotal, setTakeawayTotal] = useState(null);
  const [code, setCode] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("postcode");
    const datatype = sessionStorage.getItem("type");
    const location = sessionStorage.getItem("locationDetails");
    const time = sessionStorage.getItem("takeawaytime");

    setDeliveryFee(deliveryCharge);
    sessionStorage.setItem("deliveryFee", deliveryCharge);
    sessionStorage.setItem("discount", discount);
    setCode(data);
    setType(datatype);
    setTime(time);
    setAmount(allTotal);
  });

  useEffect(() => {
    if (!menuList) return;
    const data =
      menuList?.items &&
      Array.isArray(menuList?.items) &&
      menuList?.items.filter((item) => {
        if (item?.isAvailable === true) return item;
      });

    setFilteredList(data);
    const info = settings != null && settings?.deliveryInfo;
    setDeliveryInfo(info);
  }, [menuList]);

  useEffect(() => {
    if (type == true) {
      const dis = cartItems?.cartTotal?.cartTotalPrice / 100;
      if (deliveryInfo && dis >= deliveryInfo.minAmtForHomDelvryDiscnt) {
        const amt = dis * (deliveryInfo.discountHomeDelivery / 100);
        setDiscount(amt.toFixed(2));
      } else {
        setDiscount(0);
      }
    } else {
      const dis = cartItems?.cartTotal?.cartTotalPrice / 100;
      if (deliveryInfo && dis >= deliveryInfo.minAmtForTakAwayDiscnt) {
        const amt = dis * (deliveryInfo.discountTakeAway / 100);
        setDiscount(amt.toFixed(2));
      } else {
        setDiscount(0);
      }
    }
  }, [cartItems, deliveryInfo]);

  function extractNumberFromString(value) {
    if (!value) return 0;
    const numbersOnly = value.replace(/[^\d.-]/g, "");
    return parseFloat(numbersOnly);
  }

  useEffect(() => {
    const total = extractNumberFromString(
      cartItems?.cartTotal?.cartTotalPriceDisplay
    );
    const discountValue = parseFloat(discount || 0);
    const deliveryFee = parseFloat(deliveryCharge || 0);

    const allTotal = (total - discountValue + deliveryFee).toFixed(2);
    setAllTotal(allTotal);
  }, [cartItems, discount, deliveryCharge]);

  useEffect(() => {
    const total = cartItems?.cartTotal?.cartTotalPrice / 100;

    if (
      type === "false" &&
      total >= parseFloat(deliveryInfo?.minAmtForHomDelvryDiscnt)
    ) {
      const discountAmount =
        total * (parseFloat(deliveryInfo?.discountHomeDelivery) / 100);
      setDiscount(discountAmount.toFixed(2));
    } else if (
      type === "true" &&
      total >= parseFloat(deliveryInfo?.minAmtForTakAwayDiscnt)
    ) {
      const discountAmount =
        total * (parseFloat(deliveryInfo?.discountTakeAway) / 100);
      setTakeaway(discountAmount.toFixed(2));
      setTakeawayTotal((total - discountAmount).toFixed(2));
    }
  }, [cartItems, deliveryInfo, type]);

  const findDeliveryfee = () => {
    // calculateDeliveryFee

    if (!deliveryInfo || !cartItems) return;
    let deliveryCharge = null;
    const cartSubTotal = cartItems?.cartTotal?.cartTotalPrice / 100;
    const freeDeliveryRadius = deliveryInfo?.freeDeliveryRadius;
    const distanceRadius = sessionStorage.getItem("distance");
    const minDeliveryCharge = deliveryInfo?.minDeliveryCharge;

    const deliveryChargeType = deliveryInfo?.deliveryChargeType;

    const type = deliveryInfo?.deliveryMinAmountType;
    const cartTotalIncludesAllCharge = cartSubTotal - discount;

    const totalAmt =
      type == "Gross" ? cartSubTotal : cartTotalIncludesAllCharge;

    const minAmount = deliveryInfo?.freeDeliveryMinOrder;
    const maxRadius = deliveryInfo?.maxDeliveryRadius;

    const freeDevlivery =
      distanceRadius <= freeDeliveryRadius && totalAmt >= minAmount;

    if (!freeDevlivery) {
      if (deliveryChargeType == null) return;
      if (deliveryChargeType == "1") {
        deliveryCharge = minDeliveryCharge;
      } else if (deliveryChargeType == "2") {
        const radius = distanceRadius - freeDeliveryRadius;
        const ratePerMile = deliveryInfo?.ratePerMile;
        const ratePerMileAmt = radius * ratePerMile;
        deliveryCharge =
          minDeliveryCharge >= ratePerMileAmt
            ? minDeliveryCharge
            : ratePerMileAmt;
      }

      if (deliveryCharge == null) return;
    } else {
      deliveryCharge = 0;
    }
    return deliveryCharge;
  };

  useEffect(() => {
    const deliveryCharge = findDeliveryfee();
    if (deliveryCharge != null) {
      setDeliveryCharge(deliveryCharge);
    }
  }, [cartItems, deliveryInfo, discount]);

  return (
    <Fragment>
      <div className="m-0 p-0">
        <div className="checkout_summary_order_online_heads mt-1">
          <h4 className="text-center">Order Summary</h4>
        </div>
      </div>

      <div className="order_online_summary_checkout_table p-2 p-3">
        <div className="d-flex justify-content-between align-items-center">
          Type
          <p> {type === "false" ? "Door Delivey" : "Takeaway"}</p>
        </div>
        {type === "false" ? (
          <>
            <div className="d-flex justify-content-between align-items-center">
              Location
              <p>{code}</p>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center">
              Time
              <p>{time != null && time}</p>
            </div>
          </>
        )}

        {cartItems?.cartItems != null && cartItems?.cartItems.length !== 0 ? (
          <>
            <div className="order_online_food_list_checkout_83 p-2">
              {cartItems?.cartItems != null &&
                Array.isArray(cartItems?.cartItems) &&
                cartItems?.cartItems?.map((item, index) => {
                  const addon = item.addon_apllied;
                  const masterAddon = item?.master_addon_apllied;
                  const adjustedTotal = item?.total / 100;
                  const discountAmount = parseFloat(
                    deliveryInfo?.minAmtForHomDelvryDiscnt
                  );

                  return (
                    <>
                      <hr />
                      <div
                        className="d-flex justify-content-between align-items-center"
                        key={index}
                      >
                        <b>
                          {item?.productName}*{item?.quantity}
                        </b>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        ( {item?.variation} {item?.product_price})
                        <p className="m-0">{item?.product_total_price}</p>
                      </div>
                      {addon != null &&
                        addon.map((single, index) => {
                          const list = single?.choosedOption;
                          return (
                            <>
                              {list != null &&
                                Array.isArray(list) &&
                                list.map((data, keyindex) => {
                                  return (
                                    <div
                                      className="d-flex justify-content-between align-items-center"
                                      key={keyindex}
                                    >
                                      {data?.text}
                                      <p className="m-0">{data?.price}</p>
                                    </div>
                                  );
                                })}
                            </>
                          );
                        })}

                      {masterAddon != null &&
                        masterAddon.map((single, index) => {
                          const list = single?.choosedOption;
                          return (
                            <>
                              {list != null &&
                                Array.isArray(list) &&
                                list.map((data, dataindex) => {
                                  return (
                                    <div
                                      className="d-flex justify-content-between align-items-center"
                                      key={dataindex}
                                    >
                                      {data?.text}
                                      <p className="m-0">{data?.price}</p>
                                    </div>
                                  );
                                })}
                            </>
                          );
                        })}
                    </>
                  );
                })}
             
            </div>
            <>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <h6 className="mt-3">SubTotal</h6>
                <p className="m-0">
                  {cartItems?.cartTotal?.cartTotalPriceDisplay}
                </p>
              </div>

              <>
                {type === "true" ? (
                  <>
                    {discount && (
                      <>
                        {" "}
                        <div className="d-flex justify-content-between align-items-center">
                          <h6>Discount</h6>
                          <p className="m-0">- £{discount}</p>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {discount && (
                      <div className="d-flex justify-content-between align-items-center">
                        <h6>Discount</h6>
                        <p className="m-0">- £{discount}</p>
                      </div>
                    )}
                  </>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mt-2">Delivery fee</h6>
                  <p className="m-0">£{deliveryCharge ?? "0"}</p>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mt-2">
                    <b>Total</b>
                  </h5>
                  <h5 className="m-0">
                    <b>£{allTotal}</b>
                  </h5>
                </div>
                <div className="summary_content">
                  <small>Or Call Us at 0432 48432854</small>
                </div>
              </>
            </>
          </>
        ) : (
          ""
        )}
      </div>
    </Fragment>
  );
}

export default CheckoutSummaryComp;
