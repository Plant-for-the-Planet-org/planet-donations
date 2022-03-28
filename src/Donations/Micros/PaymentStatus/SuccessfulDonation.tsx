import React from "react";
import { useTranslation } from "next-i18next";
import { getPaymentType } from "../../PaymentMethods/PaymentFunctions";
import { getFormattedNumber } from "../../../Utils/getFormattedNumber";
import ShareOptions from "../../Micros/ShareOptions";
import { QueryParamContext } from "../../../Layout/QueryParamContext";
import ImageComponent from "./ImageComponent";
import ThankyouMessage from "./ThankyouMessage";
import { useRouter } from "next/router";
import ReturnToButton from "./Components/ReturnToButton";

function SuccessfulDonation({ donation, sendToReturn }: any) {
  const { t, i18n } = useTranslation(["common", "country", "donate"]);
  const router = useRouter();
  const [isMobile, setIsMobile] = React.useState(false);
  const { donationID, tenant, country } = React.useContext(QueryParamContext);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth > 767) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    }
  });
  const { paymentType, callbackUrl, projectDetails } =
    React.useContext(QueryParamContext);

  const imageRef = React.createRef();

  const paymentTypeUsed = getPaymentType(paymentType);

  const sendRef = () => imageRef;

  return donation ? (
    <div>
      <div className={"title-text thankyouText"} data-test-id="test-thankYou">
        {t("common:thankYou")}
      </div>

      <ThankyouMessage
        paymentTypeUsed={paymentTypeUsed}
        projectDetails={projectDetails}
        donation={donation}
      />
      <ImageComponent
        projectDetails={projectDetails}
        donation={donation}
        imageRef={imageRef}
      />

      <ShareOptions
        treeCount={getFormattedNumber(
          i18n.language,
          Number(donation.treeCount)
        )}
        sendRef={sendRef}
        donor={donation.donor}
      />
      {donationID && isMobile && router.query.step === "thankyou" && (
        <a
          href={`${
            process.env.APP_URL
          }/?context=${donationID}&tenant=${tenant}&country=${country}&locale=${localStorage.getItem(
            "language"
          )}`}
          className="donations-transaction-details donation-transaction-phone-view"
          data-test-id="referenceDonation"
        >
          {`Ref - ${donationID}`}
        </a>
      )}
      {callbackUrl && (
        <ReturnToButton
          callbackUrl={callbackUrl}
          donationContext={donationID}
          donationStatus="success"
        />
      )}
    </div>
  ) : (
    <></>
  );
}

export default SuccessfulDonation;
