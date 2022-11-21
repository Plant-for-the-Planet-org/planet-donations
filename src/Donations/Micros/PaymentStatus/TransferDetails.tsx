import React from "react";
import { useTranslation } from "next-i18next";
import CloseIcon from "../../../../public/assets/icons/CloseIcon";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import themeProperties from "../../../../styles/themeProperties";
import CopyIcon from "public/assets/icons/CopyIcon";
import ReturnToButton from "./Components/ReturnToButton";

function TransferDetails({ donationID, donation, sendToReturn }: any) {
  const { t } = useTranslation(["common"]);
  const [copiedText, setCopiedText] = React.useState("");
  const { callbackUrl, transferDetails } = React.useContext(QueryParamContext);
  const copyDetails = (detail: string, textCopied: string) => {
    navigator.clipboard.writeText(detail);
    setCopiedText(textCopied);
    setTimeout(() => setCopiedText(""), 2000);
  };
  return transferDetails ? (
    <div>
      {callbackUrl && (
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
          <p>{t("reference")}</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{donation.uid}</p>
            <div onClick={() => copyDetails(donation.uid, "reference")}>
              <CopyButton
                copiedText={copiedText}
                buttonFor={"reference"}
                t={t}
              />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>{t("amount")}</p>
          <div className={"value-container"}>
            <p
              className={"detail-value"}
            >{`${donation.currency} ${donation.amount}`}</p>
            <div onClick={() => copyDetails(donation.amount, "amount")}>
              <CopyButton copiedText={copiedText} buttonFor={"amount"} t={t} />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>{t("beneficiary")}</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{transferDetails.beneficiary}</p>
            <div
              onClick={() =>
                copyDetails(transferDetails.beneficiary, "beneficiary")
              }
            >
              <CopyButton
                copiedText={copiedText}
                buttonFor={"beneficiary"}
                t={t}
              />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>IBAN</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{transferDetails.iban}</p>
            <div onClick={() => copyDetails(transferDetails.iban, "iban")}>
              <CopyButton copiedText={copiedText} buttonFor={"iban"} t={t} />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>BIC</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{transferDetails.bic}</p>
            <div onClick={() => copyDetails(transferDetails.bic, "bic")}>
              <CopyButton copiedText={copiedText} buttonFor={"bic"} t={t} />
            </div>
          </div>
        </div>
        <div className={"single-detail"}>
          <p>{t("bank")}</p>
          <div className={"value-container"}>
            <p className={"detail-value"}>{transferDetails.bankName}</p>
            <div onClick={() => copyDetails(transferDetails.bankName, "bank")}>
              <CopyButton copiedText={copiedText} buttonFor={"bank"} t={t} />
            </div>
          </div>
        </div>
      </div>
      <div
        className={"mt-20 mb-20 text-center"}
        style={{ fontStyle: "italic" }}
      >
        {t("common:transactionId")} {donationID}
      </div>
      {callbackUrl && (
        <ReturnToButton donationContext={donationID} donationStatus="pending" />
      )}
    </div>
  ) : null;
}

export default TransferDetails;

const CopyButton = ({ copiedText, buttonFor, t }: any) => {
  return (
    <div className="copy-container">
      <p
        className={`copy-tooltip ${
          copiedText === buttonFor ? "show-tooltip" : ""
        }`}
      >
        {copiedText === buttonFor
          ? t("common:copied")
          : t("common:clickToCopy")}
      </p>
      <CopyIcon />
    </div>
  );
};
