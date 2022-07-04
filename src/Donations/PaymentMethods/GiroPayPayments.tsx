import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";

interface Props {
  onSubmitPayment: (...args: unknown[]) => unknown;
}

function GiroPayPayments({ onSubmitPayment }: Props): ReactElement {
  const { t } = useTranslation("common");

  return (
    <button
      onClick={() => onSubmitPayment("stripe", "giropay", "giropay")}
      className="primary-button w-100 mt-30"
      id="donateContinueButton"
    >
      {t("payWithGiroPay")}
    </button>
  );
}

export default GiroPayPayments;
