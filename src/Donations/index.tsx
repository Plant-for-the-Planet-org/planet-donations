import React, { ReactElement } from "react";
import ContactsForm from "./Components/ContactsForm";

import { QueryParamContext } from "../Layout/QueryParamContext";
import PaymentsForm from "./Components/PaymentsForm";
import DonationsForm from "./Components/DonationsForm";
import { useTranslation } from "react-i18next";
import ThankYou from "./Components/ThankYouComponent";
import getFormatedCurrency from "../Utils/getFormattedCurrency";
import { getFormattedNumber } from "../Utils/getFormattedNumber";
import DownArrowIcon from "../../public/assets/icons/DownArrowIcon";
import themeProperties from "../../styles/themeProperties";
import { getCountryDataBy } from "../Utils/countryUtils";

interface Props {}

function Donations({}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation("common");
  const { paymentSetup, donationStep, projectDetails } = React.useContext(
    QueryParamContext
  );

  return (
    <div className="donations-container">
      <div className="donations-card-container">
        {/* Left panel */}
        <DonationInfo />

        {/* Right panel */}
        {donationStep === 1 && <DonationsForm />}
        {donationStep === 2 && <ContactsForm />}
        {donationStep === 3 && <PaymentsForm />}
        {donationStep === 4 && <ThankYou />}
      </div>
    </div>
  );
}

function DonationInfo() {
  const { t, i18n } = useTranslation("common");
  const {
    projectDetails,
    donationID,
    donationStep,
    treeCount,
    paymentSetup,
    currency,
    contactDetails,
    giftDetails,
    isGift,
  } = React.useContext(QueryParamContext);

  return projectDetails && paymentSetup ? (
    <div className="donations-info-container">
      {/* <img
        className="background-image"
        src="/assets/images/forest2.jpg"
        width="420"
        height="560"
      />
      <div className="background-image-overlay"></div> */}
      <div className="donations-info">
        <div className="donations-info-header">
          <a
            rel="noreferrer"
            target="_blank"
            href={`https://www.trilliontreecampaign.org/${projectDetails.slug}`}
            className="title-text text-white"
          >
            {projectDetails.name}
          </a>
          <div style={{ marginTop: "8px" }} />
          {projectDetails.tpo && (
            <a
              rel="noreferrer"
              target="_blank"
              href={`https://www.trilliontreecampaign.org/t/${projectDetails.tpo.slug}`}
              className="text-white"
            >
              {t("byOrganization", {
                organizationName: projectDetails.tpo.name,
              })}
            </a>
          )}

          {(donationStep === 2 || donationStep === 3) && (
            <div>
              <div className={"w-100  text-white mt-10"}>
                {t('donating')}
                <span className="text-bold" style={{ marginRight: "4px" }}>
                  {getFormatedCurrency(
                    i18n.language,
                    currency,
                    paymentSetup.treeCost * treeCount
                  )}
                </span>
                {t("fortreeCountTrees", {
                  count: Number(treeCount),
                  treeCount: getFormattedNumber(
                    i18n.language,
                    Number(treeCount)
                  ),
                })}
              </div>
              {giftDetails && isGift && giftDetails.recipientName && (
                <div className="donation-supports-info mt-10 text-white">
                  <p>
                    {t("directGiftRecipient", {
                      name: giftDetails.recipientName,
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
          {donationStep === 3 && contactDetails.firstname && (
            <div className={"contact-details-info w-100 mt-10"}>
              <div
                className={`text-white button-reverse`}
              >
                {contactDetails.firstname && contactDetails.firstname}{" "}
                {contactDetails.lastname && contactDetails.lastname}
              </div>
                <div className="text-white">
                  <p>{contactDetails.email && contactDetails.email}</p>
                  <p>
                    {contactDetails.address && contactDetails.address}
                    {", "}
                    {contactDetails.city && contactDetails.city}
                    {", "}
                    {contactDetails.zipCode && contactDetails.zipCode}
                  </p>
                  <p>
                    {contactDetails.country &&
                      getCountryDataBy("countryCode", contactDetails.country)
                        ?.countryName}
                  </p>
                </div>
            </div>
          )}
        </div>

        <div className="donations-transaction-details">
          {donationID && `Ref - ${donationID}`}
        </div>
      </div>
    </div>
  ) : (
    <div
      className="donations-info-container"
      style={{ padding: "0px", backgroundColor: "white" }}
    >
      <div className="donations-info">
        <div className="donations-info-loader"></div>
      </div>
    </div>
  );
}

export default Donations;
