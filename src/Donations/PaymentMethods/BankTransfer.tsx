import React, { ReactElement } from "react";
import InfoIcon from "../../../public/assets/icons/InfoIcon";
import { useTranslation } from "next-i18next";

interface Props {
  onSubmitPayment: Function;
}

function BankTransfer({ onSubmitPayment }: Props): ReactElement {
  const { t } = useTranslation("common");

  return (
    <div>
      <div className={"disclaimer-container"}>
        <InfoIcon />
        <p>{t("bankTransferDisclaimer")}</p>
      </div>

      <button
        className="primary-button w-100 mt-30"
        onClick={() => onSubmitPayment("offline", "offline")}
        id="donateContinueButton"
        data-test-id="bankDonateContinue"
      >
        {t("continueWithBank")}
      </button>
    </div>
  );
}

export default BankTransfer;
