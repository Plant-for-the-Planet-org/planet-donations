import React, { ReactElement } from "react";
import InfoIcon from "../../../public/assets/icons/InfoIcon";
import { useTranslation } from "next-i18next";
import { PaymentGateway } from "@planet-sdk/common";

interface Props {
  onSubmitPayment: (gateway: PaymentGateway, method: string) => Promise<void>;
}

function BankTransfer({ onSubmitPayment }: Props): ReactElement {
  const { t, ready } = useTranslation("common");

  return ready ? (
    <div>
      <div className={"disclaimer-container"}>
        <InfoIcon />
        <p>{t("bankTransferDisclaimer")}</p>
      </div>

      <button
        className="primary-button w-100 mt-30"
        onClick={() => onSubmitPayment("offline", "transfer")}
        id="donateContinueButton"
        data-test-id="bankDonateContinue"
      >
        {t("continueWithBank")}
      </button>
    </div>
  ) : (
    <></>
  );
}

export default BankTransfer;
