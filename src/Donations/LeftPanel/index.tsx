import { ReactElement, useContext, useState, useEffect } from "react";
import LeftPanelContainer from "./LeftPanelContainer";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import LeftPanelHeader from "./LeftPanelHeader";
import TopProjectBadge from "./TopProjectBadge";
import LeftPanelInfo from "./LeftPanelInfo";
import CancelButton from "../../Common/CancelButton";

function LeftPanel(): ReactElement {
  const {
    projectDetails,
    pCashSignupDetails,
    donationID,
    donationStep,
    quantity,
    paymentSetup,
    currency,
    contactDetails,
    giftDetails,
    isGift,
    tenant,
    frequency,
    onBehalf,
    onBehalfDonor,
    isPlanetCashActive,
    country,
    callbackUrl,
  } = useContext(QueryParamContext);

  const [isMobile, setIsMobile] = useState(false);

  const canShowCancelPaymentButton =
    isMobile && donationStep !== 0 ? true : callbackUrl.length > 0;
  const canShowTopProjectBadge =
    projectDetails !== null &&
    projectDetails.isApproved &&
    projectDetails.isTopProject;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth > 767) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    }
  });

  return (
    <LeftPanelContainer
      info={pCashSignupDetails || projectDetails}
      donationStep={donationStep}
      tenant={tenant}
    >
      <LeftPanelHeader>
        {canShowCancelPaymentButton && (
          <CancelButton returnUrl={callbackUrl || "/"} />
        )}
        {canShowTopProjectBadge && <TopProjectBadge />}
      </LeftPanelHeader>
      {/* TODO - evaluate whether to send this info to LeftPanelInfo, or use context instead */}
      <LeftPanelInfo
        projectDetails={projectDetails}
        pCashSignupDetails={pCashSignupDetails}
        donationStep={donationStep}
        donationID={donationID}
        paymentSetup={paymentSetup}
        isMobile={isMobile}
        giftDetails={giftDetails}
        isPlanetCashActive={isPlanetCashActive}
        isGift={isGift}
        quantity={quantity}
        currency={currency}
        frequency={frequency}
        contactDetails={contactDetails}
        onBehalf={onBehalf}
        onBehalfDonor={onBehalfDonor}
        tenant={tenant}
        country={country}
      />
    </LeftPanelContainer>
  );
}

export default LeftPanel;
