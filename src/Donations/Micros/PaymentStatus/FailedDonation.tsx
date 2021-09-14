import React from "react";
import { useTranslation } from "next-i18next";
import PaymentFailedIllustration from "../../../../public/assets/icons/donation/PaymentFailed";
import CloseIcon from "../../../../public/assets/icons/CloseIcon";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";

function FailedDonation({sendToReturn}:any) {
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
          {t("common:donationFailed")}
        </div>
        <div className={"mt-20 text-center"}>
          {t("common:donationFailedMessage")}
        </div>
        <PaymentFailedIllustration />
      </div>
    );

}

export default FailedDonation;
