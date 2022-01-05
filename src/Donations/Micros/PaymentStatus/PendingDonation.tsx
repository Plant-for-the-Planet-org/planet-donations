import React from "react";
import { useTranslation } from "next-i18next";
import PaymentPendingIllustration from "../../../../public/assets/icons/donation/PaymentPending";
import CloseIcon from "../../../../public/assets/icons/CloseIcon";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import ReturnToButton from "./Components/ReturnToButton";

function PendingDonation({ donationID, sendToReturn }: any) {
  const { t } = useTranslation(["common"]);
  const {
    returnTo,
  } = React.useContext(QueryParamContext);
  return (
    <div>
      {returnTo && (
        <button
          id={"thank-you-close"}
          onClick={() => sendToReturn()}
          className="mb-10"
          style={{ alignSelf: "flex-start" }}
        >
          <CloseIcon color={themeProperties.light.primaryFontColor} />
        </button>
      )}

      <div className={"title-text text-center"} data-test-id="test-thankYou">
        {t("common:donationPending")}
      </div>
      <div className={"mt-20 text-center"}>
        {t("common:donationPendingMessage")}
      </div>
      <div className={"mt-20 text-center"} style={{ fontStyle: "italic" }}>
        {t("common:transactionId")} {donationID}
      </div>
      <PaymentPendingIllustration />
      {returnTo && (
        <ReturnToButton returnTo={returnTo} donationContext={donationID} donationStatus="pending" />
      )}
    </div>
  );
}

export default PendingDonation;
