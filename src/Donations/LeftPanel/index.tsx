import { ReactElement, useContext, useState, useEffect } from "react";
import LeftPanelContainer from "./LeftPanelContainer";
import BackButton from "../../Common/CancelButton";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import LeftPanelHeader from "./LeftPanelHeader";
import TopProjectBadge from "./TopProjectBadge";
import LeftPanelInfo from "./LeftPanelInfo";
import CancelButton from "../../Common/CancelButton";
import { useRouter } from "next/router";

function LeftPanel(): ReactElement {
  const {
    projectDetails,
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
  const [isPathStored, setIsPathStored] = useState(false);
  const [canShowCanceDonationButton, setCanShowCanceDonationButton] =
    useState(false);
  const router = useRouter();

  const canShowBackButton =
    isMobile && (callbackUrl.length > 0 || donationStep !== 0);
  const canShowTopProjectBadge =
    projectDetails !== null &&
    projectDetails.purpose !== "planet-cash-signup" &&
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

  function storePathValues() {
    const storage = globalThis?.sessionStorage;
    // console.log("executed");
    if (!storage) return;
    // Set the previous path as the value of the current path.
    const prevPath = storage.getItem("currentPath");
    storage.setItem("prevPath", prevPath);
    // Set the current path value by looking at the window object.
    storage.setItem("currentPath", window.origin);
    setIsPathStored(true);
  }
  useEffect(() => {
    storePathValues();
  }, []);

  useEffect(() => {
    const storage = globalThis?.sessionStorage;
    console.log(donationStep);
    setIsPathStored(false);
    if (!storage || donationStep !== 1) return;
    storage.setItem(
      "showCancelDonationButton",
      `${
        storage.getItem("prevPath") !== "null" || router.query["callback_url"]
      }`
    );
    const isShow = storage.getItem("showCancelDonationButton") === "true";

    setCanShowCanceDonationButton(isShow);
  }, [router.query.step]);

  return (
    <LeftPanelContainer
      projectDetails={projectDetails}
      donationStep={donationStep}
      tenant={tenant}
    >
      <LeftPanelHeader>
        {canShowCanceDonationButton && (
          <CancelButton returnUrl={callbackUrl || "/"} />
        )}
        {canShowTopProjectBadge && <TopProjectBadge />}
      </LeftPanelHeader>
      {/* TODO - evaluate whether to send this info to LeftPanelInfo, or use context instead */}
      <LeftPanelInfo
        projectDetails={projectDetails}
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
