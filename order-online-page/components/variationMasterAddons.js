import React, { Fragment, useEffect, useState } from "react";

function VariationMasterAddons({
  foodValues,
  setMasterAddons,
  variationValue,
}) {
  const [checkedState, setCheckedState] = useState({});
  const [checkedBoxCount, setCheckedBoxCount] = useState(0);

  const handleCheckboxChange = (item, option, e, index) => {
    const containerClass = `${item.name}${item?.id}${item.minimumRequired}${item?.maximumRequired}${index}`;
    const checkboxes =
      document
        .querySelector(`.${containerClass}`)
        ?.querySelectorAll('input[type="checkbox"]') ?? [];

    let checkedCount = 0;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedCount++;
      }
    });

    setCheckedBoxCount(checkedCount);

    const isChecked = e.target.checked;

    // Update the checked state
    setCheckedState((prevState) => ({
      ...prevState,
      [containerClass]: {
        ...prevState[containerClass],
        [option.text]: isChecked,
      },
    }));

    // Only apply the limit if maximumRequired is not 0
    if (item?.maximumRequired > 0) {
      if (checkedCount >= item?.maximumRequired) {
        checkboxes.forEach((checkbox) => {
          if (!checkbox.checked) {
            checkbox.disabled = true;
          }
        });
      } else {
        checkboxes.forEach((checkbox) => {
          checkbox.disabled = false;
        });
      }
    } else {
      // If there is no limit, make sure all checkboxes are enabled
      checkboxes.forEach((checkbox) => {
        checkbox.disabled = false;
      });
    }

    // Update masterAddons state
    const newValue = option?.itemId.toString();
    setMasterAddons((prev) => {
      if (isChecked) {
        return {
          ...prev,
          [item?.id]: [...(prev[item?.id] ?? []), newValue],
        };
      } else {
        const updatedAddOns = {
          ...prev,
        };
        if (updatedAddOns[item?.id]) {
          updatedAddOns[item?.id] = updatedAddOns[item?.id].filter(
            (value) => value !== newValue
          );
        }
        return updatedAddOns;
      }
    });
  };
  return (
    <Fragment>
      {foodValues &&
        foodValues?.masterAddons.length !== 0 &&
        foodValues?.masterAddons.map((item, key) => {
          const containerClass = `${item.name}${item?.id}${item.minimumRequired}${item?.maximumRequired}${key}`;

          let maxCheckCount =
            typeof item?.maximumRequired === "string"
              ? parseInt(item?.maximumRequired)
              : item?.maximumRequired;

          const isAnyChecked = Object.values(
            checkedState[containerClass] || {}
          ).some((checked) => checked === true);

          return (
            <Fragment key={key}>
              <div className="col">
                <p className="sub_head_0291 mb-0">
                  {item?.name ?? "N/A"}{" "}
                  {(item?.minimumRequired != 0 ||
                    item?.maximumRequired != 0) && (
                    <span className="info_label_0291">
                      min -{" "}
                      {item?.minimumRequired &&
                        item?.minimumRequired != 0 &&
                        item?.minimumRequired}{" "}
                      {item?.maximumRequired &&
                        item?.maximumRequired != 0 &&
                        "| max -" + item?.maximumRequired}
                    </span>
                  )}
                </p>
                <div className={containerClass}>
                  <table className="menu_table_0291">
                    {item?.options &&
                      item?.options.map((data, index) => {
                        const isChecked =
                          checkedState[containerClass]?.[data.text] || false;

                        const isVariationCheck =
                          variationValue &&
                          variationValue.name &&
                          variationValue.name.length !== 0;

                        return (
                          <Fragment key={index}>
                            <tr key={index}>
                              <td className="d-flex">
                                <label
                                  // htmlFor={varient?.name}
                                  className="delivery_option_container"
                                >
                                  <input
                                    type="checkbox"
                                    name="addOns"
                                    id="variations"
                                    className="delivery_option variation_list"
                                    checked={isChecked}
                                    onChange={(e) =>
                                      handleCheckboxChange(item, data, e, key)
                                    }
                                    defaultChecked={false}
                                  />
                                  <span className="checkmark"></span>
                                  <span
                                    // className={
                                    //   checkedBoxCount >= maxCheckCount &&
                                    //   !isChecked &&
                                    //   maxCheckCount > 0
                                    //     ? "varient_name disabled"
                                    //     : "varient_name "
                                    // }
                                    className="varient_name"
                                  >
                                    {data?.text ?? "N/A"}
                                  </span>
                                </label>
                              </td>
                              <td
                                style={{
                                  whiteSpace: "nowrap",
                                  userSelect: "none",
                                }}
                              >
                                + {data?.price_formatted ?? "N/A"}
                              </td>
                            </tr>
                          </Fragment>
                        );
                      })}
                  </table>
                </div>
              </div>
            </Fragment>
          );
        })}
    </Fragment>
  );
}

export default VariationMasterAddons;
