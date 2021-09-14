import React from "react";
import { useTranslation } from "next-i18next";
import PaymentPendingIllustration from "../../../../public/assets/icons/donation/PaymentPending";
import CloseIcon from "../../../../public/assets/icons/CloseIcon";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";

function PendingDonation({donationID,sendToReturn}:any) {
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

        <div className={"title-text text-center"}>
          {t("common:donationPending")}
        </div>
        <div className={"mt-20 text-center"}>
          {t("common:donationPendingMessage")}
        </div>
        <div className={"mt-20 text-center"} style={{ fontStyle: "italic" }}>
          {t("common:donationRef")} {donationID}
        </div>
        <PaymentPendingIllustration />
      </div>
    );
}

export default PendingDonation;
