import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";

interface Props {
  onSubmitPayment: Function;
}

function BoletoPayPayments({ onSubmitPayment }: Props): ReactElement {
  const { t } = useTranslation("common");

  return (
    <button
      onClick={() => onSubmitPayment("stripe", "boleto", "boleto")}
      className="primary-button w-100 mt-30"
      id="donateContinueButton"
    >
      {t("payWithBoleto")}
    </button>
  );
}

export default BoletoPayPayments;
