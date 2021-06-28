import React, { ReactElement } from "react";
import InfoIcon from "../../../public/assets/icons/InfoIcon";
import { useTranslation } from "next-i18next";

interface Props {
  onSubmitPayment: Function;
}

function SofortPayments({ onSubmitPayment }: Props): ReactElement {
  const { t, i18n, ready } = useTranslation("common");

  return (
    <div>
      <div className={"disclaimer-container"}>
        <InfoIcon />
        <p>{t("sofortDisclaimer")}</p>
      </div>

      <button
        className="primary-button w-100 mt-30"
        onClick={() => onSubmitPayment("stripe_sofort", "sofort")}
        id="donateContinueButton"
      >
        {t("payWithSofort")}
      </button>
    </div>
  );
}

export default SofortPayments;
