import React, { ReactElement } from "react";
import InfoIcon from "../../../public/assets/icons/InfoIcon";
import { useTranslation } from "next-i18next";

interface Props {
  onSubmitPayment: (
    gateway: string,
    method: string,
    providerObject?: string
  ) => Promise<void>;
}

function SofortPayments({ onSubmitPayment }: Props): ReactElement {
  const { t, ready } = useTranslation("common");

  return ready ? (
    <div>
      <div className={"disclaimer-container"}>
        <InfoIcon />
        <p>{t("sofortDisclaimer")}</p>
      </div>

      <button
        className="primary-button w-100 mt-30"
        onClick={() => onSubmitPayment("stripe", "sofort", "sofort")}
        id="donateContinueButton"
        data-test-id="sofortDonateContinue"
      >
        {t("payWithSofort")}
      </button>
    </div>
  ) : (
    <></>
  );
}

export default SofortPayments;
