import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import getFormatedCurrency, {
  getFormatedCurrencySymbol,
} from "../../../Utils/getFormattedCurrency";
import DownArrowIcon from "../../../../public/assets/icons/DownArrowIcon";
import TreeCostLoader from "../../../Common/ContentLoaders/TreeCostLoader";
import LeafIcon from "../../../../public/assets/icons/LeafIcon";
import PlantPotIcon from "../../../../public/assets/icons/PlantPotIcon";
import TreeIcon from "../../../../public/assets/icons/TreeIcon";
import TwoLeafIcon from "../../../../public/assets/icons/TwoLeafIcon";
import CustomIcon from "../../../../public/assets/icons/CustomIcon";
import { useRouter } from "next/router";
import { approximatelyEqual } from "src/Utils/common";
import { getFormattedNumber } from "src/Utils/getFormattedNumber";

interface Props {
  setopenCurrencyModal: any;
}

function FundingDonations({ setopenCurrencyModal }: Props): ReactElement {
  const { t, i18n } = useTranslation(["common", "country"]);

  const [customInputValue, setCustomInputValue] = React.useState("");

  const [isCustomDonation, setisCustomDonation] = React.useState(false);
  // const AllIcons = [
  //   <LeafIcon />,
  //   <TwoLeafIcon />,
  //   <PlantPotIcon />,
  //   <TreeIcon />,
  // ];
  const {
    paymentSetup,
    currency,
    quantity,
    setquantity,
    isGift,
    giftDetails,
    frequency,
    retainQuantityValue,
    isPlanetCashActive,
  } = React.useContext(QueryParamContext);

  const router = useRouter();

  const setCustomValue = (e: any) => {
    if (e.target) {
      if (e.target.value === "" || e.target.value < 1) {
        // if input is '', default 1
        setquantity(
          paymentSetup.purpose === "conservation"
            ? 1
            : 1 / paymentSetup.unitCost
        );
      } else if (e.target.value.toString().length <= 12) {
        setquantity(
          paymentSetup.purpose === "conservation"
            ? e.target.value
            : e.target.value / paymentSetup.unitCost
        );
      }
    }
  };

  useEffect(() => {
    if (isCustomDonation) {
      customInputRef?.current?.focus();
    }
  }, [isCustomDonation]);

  const customInputRef = React.useRef(null);

  React.useEffect(() => {
    if (
      paymentSetup.frequencies &&
      paymentSetup.frequencies[`${frequency}`].options
    ) {
      // Set all quantities in the allOptionsArray
      const newallOptionsArray = [];
      for (const option of paymentSetup.frequencies[`${frequency}`].options) {
        newallOptionsArray.push(option.quantity * paymentSetup.unitCost);
      }
      const defaultPaymentOption = paymentSetup.frequencies[
        `${frequency}`
      ].options.filter((option) => option.isDefault === true);

      let newQuantity = retainQuantityValue
        ? quantity * paymentSetup.unitCost
        : router.query.units
        ? Number(router.query.units * paymentSetup.unitCost)
        : defaultPaymentOption.length > 0
        ? defaultPaymentOption[0].quantity * paymentSetup.unitCost
        : paymentSetup.frequencies[`${frequency}`].options[1].quantity *
          paymentSetup.unitCost;
      newQuantity = Number(
        getFormattedNumber(
          i18n.language,
          Number(newQuantity / paymentSetup.unitCost)
        )
      );
      setquantity(newQuantity);

      if (
        newQuantity &&
        newallOptionsArray.filter((option) =>
          approximatelyEqual(option, newQuantity * paymentSetup.unitCost)
        ).length == 0
      ) {
        setCustomInputValue(
          getFormattedNumber(
            i18n.language,
            paymentSetup.unit !== "currency"
              ? newQuantity
              : newQuantity * paymentSetup.unitCost
          )
        );
        setisCustomDonation(true);
      } else if (newQuantity == 0) {
        setisCustomDonation(true);
      } else {
        setCustomInputValue("");
        setisCustomDonation(false);
      }
    }
  }, [paymentSetup]);

  // IMP TO DO -> Due to new requirements of showing Rounded costs for Bouquet and in future for all we will now have to start passing the amount instead of quantity and unitCost, this demands a structural change in multiple files and hence should be done carefully

  // const roundedCostCalculator=(unitCost,quantity)=>{
  //   console.log(`unitCost,quantity`, unitCost,quantity)
  //   const cost = unitCost  * quantity;
  //   return Math.trunc(Math.ceil(cost/5)*5);
  // }
  return (
    <>
      <div
        className={`funding-selection-options-container ${
          isGift && giftDetails.recipientName === "" ? "display-none" : ""
        }`}
      >
        {paymentSetup.frequencies &&
          paymentSetup.frequencies[`${frequency}`].options.map(
            (option, index) => {
              return option.quantity ? (
                <div
                  key={index}
                  onClick={() => {
                    setquantity(option.quantity);
                    setisCustomDonation(false);
                    setCustomInputValue("");
                  }}
                  className={`funding-selection-option ${
                    approximatelyEqual(option.quantity, quantity) &&
                    !isCustomDonation
                      ? "funding-selection-option-selected"
                      : ""
                  }`}
                  // style={{ maxWidth: "100px" }}
                >
                  {/* <div
                  className={"funding-icon"}
                  style={{ height: "auto", width: "auto" }}
                >
                  {AllIcons[index]}
                </div> */}
                  <div className="funding-selection-option-text m-10">
                    <span style={{ fontSize: "18px" }}>
                      {paymentSetup.purpose === "conservation"
                        ? option.quantity
                        : getFormatedCurrency(
                            i18n.language,
                            currency,
                            option.quantity * paymentSetup.unitCost
                          )}{" "}
                      {paymentSetup.purpose === "conservation" ? t("m2") : []}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`funding-selection-option custom ${
                    isCustomDonation ? "funding-selection-option-selected" : ""
                  }`}
                  onClick={() => {
                    setisCustomDonation(true);
                    customInputRef?.current?.focus();
                  }}
                  style={{ flexGrow: 1 }}
                >
                  {isCustomDonation ? (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <p
                        style={{
                          fontSize: "18px",
                          marginTop: "3px",
                        }}
                      >
                        {paymentSetup.purpose === "bouquet"
                          ? getFormatedCurrencySymbol(currency)
                          : []}
                      </p>
                      <input
                        className={"funding-custom-tree-input"}
                        style={{ fontSize: "18px" }}
                        onInput={(e) => {
                          // replaces any character other than number to blank
                          // e.target.value = e.target.value.replace(/[,]/g, '.');
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          //  if length of input more than 12, display only 12 digits
                          if (e.target.value.toString().length >= 12) {
                            e.target.value = e.target.value
                              .toString()
                              .slice(0, 12);
                          }
                        }}
                        value={customInputValue}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        onChange={(e) => {
                          setCustomValue(e);
                          setCustomInputValue(e.target.value);
                        }}
                        ref={customInputRef}
                      />
                      <p
                        style={{
                          fontSize: "18px",
                          marginTop: "3px",
                          fontWeight: "800",
                        }}
                      >
                        {paymentSetup.purpose === "conservation"
                          ? t(paymentSetup.unit)
                          : []}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="funding-selection-option-text"
                      style={{ fontSize: "18px" }}
                    >
                      <p style={{ margin: "5px" }}>
                        {" "}
                        {paymentSetup.unit === "currency"
                          ? t("customAmount")
                          : t("custom")}
                      </p>
                    </div>
                  )}
                </div>
              );
            }
          )}
      </div>
      {paymentSetup && paymentSetup.unitCost ? (
        <p className="currency-selection mt-30">
          <button
            onClick={() => {
              // Lock the currency/country change if planetCash is active
              !isPlanetCashActive && setopenCurrencyModal(true);
            }}
            className="text-bold text-primary"
            style={{
              marginRight: "4px",
              ...(isPlanetCashActive && { cursor: "text" }),
            }}
            data-test-id="currency"
          >
            {paymentSetup.purpose !== "conservation" ? (
              <span style={{ marginRight: "4px" }} className={"text-normal"}>
                {t("selectCurrency")}
              </span>
            ) : (
              []
            )}
            {currency}
            {!isPlanetCashActive && (
              <DownArrowIcon color={themeProperties.primaryColor} />
            )}
            {paymentSetup.purpose === "conservation"
              ? getFormatedCurrency(
                  i18n.language,
                  "",
                  Number(paymentSetup.unitCost)
                )
              : []}{" "}
          </button>
          {paymentSetup.purpose === "conservation" ? t("perm2") : []}
        </p>
      ) : (
        <div className={"mt-20"}>
          <TreeCostLoader width={150} />
        </div>
      )}
    </>
  );
}

export default FundingDonations;
