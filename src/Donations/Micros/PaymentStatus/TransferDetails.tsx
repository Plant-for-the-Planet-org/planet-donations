import React from "react";
import { useTranslation } from "next-i18next";
import CloseIcon from "../../../../public/assets/icons/CloseIcon";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import CopyIcon from "public/assets/icons/CopyIcon";

function TransferDetails({ donationID, donation, sendToReturn }: any) {
  const { t } = useTranslation(["common"]);
  const { returnTo, transferDetails } = React.useContext(QueryParamContext);
  const copyDetails = (detail: string) => {
    navigator.clipboard.writeText(detail);
  };
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
        {t("common:transferDetails")}
      </div>
      <div className={"mt-20 text-center"}>
        {t("common:transferDetailsMessage")}
      </div>
      <div className={"transfer-details"}>
        <div className={"single-detail"}>
          <p>Reference</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{donation.uid}</p>
            <div onClick={() => copyDetails(donation.uid)}>
              <CopyIcon />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>Amount</p>
          <div className={"value-container"}>
            <p
              className={"detail-value"}
            >{`${donation.currency} ${donation.amount}`}</p>
            <div onClick={() => copyDetails(donation.amount)}>
              <CopyIcon />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>Beneficiary</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{transferDetails?.beneficiary}</p>
            <div onClick={() => copyDetails(transferDetails?.beneficiary)}>
              <CopyIcon />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>IBAN</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{transferDetails?.iban}</p>
            <div onClick={() => copyDetails(transferDetails?.iban)}>
              <CopyIcon />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>BIC</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{transferDetails?.bic}</p>
            <div onClick={() => copyDetails(transferDetails?.bic)}>
              <CopyIcon />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>Bank</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{transferDetails?.bankName}</p>
            <div onClick={() => copyDetails(transferDetails?.bankName)}>
              <CopyIcon />
            </div>
          </div>
        </div>
      </div>
      <div className={"mt-20 text-center"} style={{ fontStyle: "italic" }}>
        {t("common:donationRef")} {donationID}
      </div>
    </div>
  );
}

export default TransferDetails;
