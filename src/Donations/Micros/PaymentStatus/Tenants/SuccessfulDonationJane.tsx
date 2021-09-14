import React from "react";
import { useTranslation } from "next-i18next";
import { getPaymentType } from "../../../PaymentMethods/PaymentFunctions";
import { QueryParamContext } from "../../../../Layout/QueryParamContext";
import ThankyouMessage from "./../ThankyouMessage";

function SuccessfulDonationJane({ donation, sendToReturn }: any) {
  const { t, i18n } = useTranslation(["common", "country", "donate"]);

  const { paymentType, returnTo, projectDetails } =
    React.useContext(QueryParamContext);

  const imageRef = React.createRef();

  const paymentTypeUsed = getPaymentType(paymentType);

  const sendRef = () => imageRef;

  let returnDisplay;
  if (returnTo) {
    const x = returnTo.slice(8);
    returnDisplay = x.split("/", 2);
  }

  return donation ? (
    <div>
      {returnTo && (
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
      <div
        style={{
          position: "relative",
          paddingTop: "100%",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        <iframe
          src="https://iframe.videodelivery.net/bcfdbb475e878cbe4559e8f5d2ba094e?preload=true&autoplay=true"
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
    </div>
  ) : (
    <></>
  );
}

export default SuccessfulDonationJane;
