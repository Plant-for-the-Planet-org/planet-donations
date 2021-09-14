import React from "react";
import { useTranslation } from "next-i18next";
import { getPaymentType } from "../../PaymentMethods/PaymentFunctions";
import { getFormattedNumber } from "../../../Utils/getFormattedNumber";
import ShareOptions from "../../Micros/ShareOptions";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import ImageComponent from "./ImageComponent";
import ThankyouMessage from "./ThankyouMessage";

function SuccessfulDonation({ donation, sendToReturn }: any) {
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
      <ImageComponent projectDetails={projectDetails} donation={donation} />

      <ShareOptions
        treeCount={getFormattedNumber(
          i18n.language,
          Number(donation.treeCount)
        )}
        sendRef={sendRef}
        donor={donation.donor}
      />
    </div>
  ) : (
    <></>
  );
}

export default SuccessfulDonation;
