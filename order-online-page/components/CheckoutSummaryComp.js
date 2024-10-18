import React, { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import toast from "react-hot-toast";
import { getSessionStorageItem } from "@/src/app/_utils/ClientUtils";

function CheckoutSummaryComp() {
  const {
    cartItems,
    menuList,
    setDeliveryFee,
    type,
    setType,
    settings,
    setAmount,
    amount,
  } = useContext(AppContext);

  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [takeaway, setTakeaway] = useState(null);
  const [takeawayTotal, setTakeawayTotal] = useState(null);
  const [code, setCode] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const [postcodeData, setPostcodeData] = useState(null);
  const [time, setTime] = useState(null);
  const [details, setDetails] = useState(null);
  useEffect(() => {
    const data = sessionStorage.getItem("postcode");
    const deliveryInfo = JSON.parse(getSessionStorageItem("deliveryResponse"));
    setDetails(deliveryInfo);
    const datatype = sessionStorage.getItem("type");
    const location = sessionStorage.getItem("locationDetails");
    const time = sessionStorage.getItem("takeawaytime");
    sessionStorage.setItem("deliveryFee", deliveryCharge);
    setCode(data);
    setType(datatype);
    setTime(time);
    sessionStorage.setItem("deliveryFee", amount);
  }, []);

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

  function extractNumberFromString(value) {
    if (!value) return 0;
    const numbersOnly = value.replace(/[^\d.-]/g, "");
    return parseFloat(numbersOnly);
  }

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
    if (!deliveryInfo || !cartItems) return;

    const typeofDelivery = deliveryInfo?.fixedDeliveryCharge;
    let deliveryCharge = null;

    const cartSubTotal = cartItems?.cartTotal?.cartTotalPrice / 100;
    const freeDeliveryRadius = deliveryInfo?.freeDeliveryRadius;
    const distanceRadius = parseFloat(sessionStorage.getItem("distance"));
    const minDeliveryCharge = deliveryInfo?.minDeliveryCharge;
    const deliveryChargeType = deliveryInfo?.deliveryChargeType;
    const chargeType = deliveryInfo?.deliveryMinAmountType;
    const cartTotalIncludesAllCharge = cartSubTotal - parseFloat(discount || 0);
    const totalAmt =
      chargeType === "Gross" ? cartSubTotal : cartTotalIncludesAllCharge;
    const minAmount = deliveryInfo?.freeDeliveryMinOrder;
    const maxRadius = deliveryInfo?.maxDeliveryRadius;
    const roundedDistance = Math.round(distanceRadius);

    const freeDelivery =
      distanceRadius <= freeDeliveryRadius && totalAmt >= minAmount;

    if (typeofDelivery === "byDefault") {
      if (!freeDelivery) {
        if (!deliveryChargeType) return;

        if (deliveryChargeType === "1") {
          deliveryCharge = minDeliveryCharge;
        } else if (deliveryChargeType === "2") {
          const additionalRadius = distanceRadius - freeDeliveryRadius;
          const ratePerMile = deliveryInfo?.ratePerMile;
          const ratePerMileAmt = roundedDistance * ratePerMile;

          deliveryCharge =
            minDeliveryCharge >= ratePerMileAmt
              ? minDeliveryCharge
              : ratePerMileAmt;
        }

        if (deliveryCharge == null) return;
      } else {
        deliveryCharge = 0;
      }
    } else if (typeofDelivery === "byDistance") {
      const charge = sessionStorage.getItem("newfee");
      console.log(charge, "charge");
      deliveryCharge = charge && charge != undefined && charge / 100;
    } else if (typeofDelivery === "byPostCode") {
      const postcodelist = deliveryInfo?.FixedDeliveryLocationList;
      const isDeliveryPossible = postcodelist?.find((location) => {
        const cleanedPostcode = location.postcode
          .replace(/\s+/g, "")
          .toLowerCase();
        const cleanedCode = code.replace(/\s+/g, "").toLowerCase();
        return cleanedPostcode === cleanedCode;
      });

      setPostcodeData(isDeliveryPossible);

      if (!isDeliveryPossible) {
        toast.error("Delivery is not Available at this Location!");
        return null;
      }
      deliveryCharge = postcodeData != null && postcodeData.amount / 100;
    } else {
      toast.error("Postal Code is not Recognised!");
    }

    return deliveryCharge;
  };

  useEffect(() => {
    const deliveryCharge = findDeliveryfee();

    if (
      deliveryCharge != null ||
      deliveryCharge != false ||
      deliveryCharge != undefined
    ) {
      setDeliveryCharge(deliveryCharge);
      setDeliveryFee(deliveryCharge);
      sessionStorage.setItem("deliveryFee", deliveryCharge);
    } else {
      setDeliveryFee(0);
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
          <p>
            {" "}
            {type === "false" || type === false ? "Door Delivey" : "Takeaway"}
          </p>
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

        {cartItems?.cartItems != null && cartItems?.cartItems.length !== 0 && (
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
                <p className="mt-3">
                  <b>SubTotal</b>
                </p>
                <p className="m-0">{details?.cart_GrossAmount ?? 0}</p>
              </div>
              <Fragment>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <h6>Discount</h6>
                  <p className="m-0">- £{details?.discountAmount ?? 0}</p>
                </div>

                {/* {type === "true" ? (
                  <>
                    {discount && (
                      <>
                        {" "}
                        <div className="d-flex justify-content-between align-items-center"></div>
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
                )} */}

                {type === "false" || type === false ? (
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mt-2">Delivery fee </h6>
                    <p className="m-0">£{details?.deliveryFeeAmount ?? 0}</p>
                  </div>
                ) : (
                  <Fragment></Fragment>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mt-2">
                    <b>Total</b>
                  </h5>
                  <h5 className="m-0">
                    <b>£{details?.cart_NetAmount ?? 0}</b>
                  </h5>
                </div>
                {/* <div className="summary_content">
                  <small>Or Call Us at 0432 48432854</small>
                </div> */}
              </Fragment>
            </>
          </>
        )}
      </div>
    </Fragment>
  );
}

export default CheckoutSummaryComp;
