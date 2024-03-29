import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { getPaymentType } from "../../../PaymentMethods/PaymentFunctions";
import { QueryParamContext } from "../../../../Layout/QueryParamContext";
import ThankyouMessage from "./../ThankyouMessage";
import PaymentProgress from "src/Common/ContentLoaders/Donations/PaymentProgress";
import { Donation } from "@planet-sdk/common/build/types/donation";

interface SuccessfulDonationJaneProps {
  donation: Donation;
  sendToReturn: () => void;
}

function SuccessfulDonationJane({
  donation,
  sendToReturn,
}: SuccessfulDonationJaneProps): ReactElement {
  const { t } = useTranslation(["common", "country", "donate"]);

  const { paymentType, callbackUrl, projectDetails } =
    React.useContext(QueryParamContext);

  const paymentTypeUsed = getPaymentType(paymentType);

  let returnDisplay;
  if (callbackUrl) {
    const x = callbackUrl.slice(8);
    returnDisplay = x.split("/", 2);
  }

  return donation && projectDetails ? (
    <div>
      {callbackUrl && returnDisplay && (
        <button
          id={"thank-you-close"}
          onClick={() => sendToReturn()}
          className="mb-10 text-primary"
          style={{ alignSelf: "flex-start" }}
        >
          Back to {returnDisplay[0]}
        </button>
      )}
      <div className={"title-text thankyouText"} data-test-id="test-thankYou">
        {t("common:thankYou")}
      </div>
      <ThankyouMessage
        paymentTypeUsed={paymentTypeUsed}
        projectDetails={projectDetails}
        donation={donation}
      />
      <div className={"mt-20 thankyouText"}>
        {t("common:janeSuccessMessage")}
      </div>
      <div
        style={{
          position: "relative",
          paddingTop: "100%",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        <iframe
          src="https://iframe.videodelivery.net/bfac441938614b90e85251d11fbdf9b6?preload=true&autoplay=true"
          style={{
            border: "none",
            position: "absolute",
            top: 0,
            height: "100%",
            width: "100%",
            borderRadius: "10px",
          }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
      </div>
      <a
        href="https://www.treesforjane.org/"
        className={"mt-20 linkText mb-20 text-center"}
      >
        {t("common:backToTreesForJane")}
      </a>
    </div>
  ) : (
    <PaymentProgress isPaymentProcessing={true} />
  );
}

export default SuccessfulDonationJane;
