import React, { ReactElement, useState } from "react";
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

  return paymentSetup && projectDetails ? (
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
  ) : (
    <></>
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
  } = React.useContext(QueryParamContext);

  const [showContactDetails, setshowContactDetails] = React.useState(false);
  return (
    <div className="donations-info-container">
      {/* <img
        className="background-image"
        src="/assets/images/forest2.jpg"
        width="420"
        height="560"
      /> */}
      {/* <div className="background-image-overlay"></div> */}
      <div className="donations-info">
        <div className="donations-info-header">
          <p className="title-text text-white">{projectDetails.name}</p>
          {projectDetails.tpo && (
            <p className="text-white mt-10">
            {t("byOrganization", {
              organizationName: projectDetails.tpo.name,
            })}
          </p>
          )}
          
          {(donationStep === 2 || donationStep === 3) && (
            <div className={"w-100  text-white mt-10"}>
              <span className="text-bold" style={{ marginRight: "4px" }}>
                {getFormatedCurrency(
                  i18n.language,
                  currency,
                  paymentSetup.treeCost * treeCount
                )}
              </span>
              {t("fortreeCountTrees", {
                count: Number(treeCount),
                treeCount: getFormattedNumber(i18n.language, Number(treeCount)),
              })}
            </div>
          )}
          {donationStep  === 3 &&  contactDetails.firstname && (
            <div className={"contact-details-info w-100 mt-10"}>
              <button
                onClick={() => setshowContactDetails(!showContactDetails)}
                className={`text-white ${
                  showContactDetails ? "button-reverse" : ""
                }`}
              >
                {contactDetails.firstname && contactDetails.firstname}{" "}
                {contactDetails.lastname && contactDetails.lastname}
                <DownArrowIcon color={themeProperties.light.light} />
              </button>
              {showContactDetails && (
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
              )}
            </div>
          )}
        </div>

        <div className="donations-transaction-details">
          {donationID && <p>Donation ID - {donationID}</p>}
          <p>This donation is processed by Plant-for-the-Planet</p>
        </div>
      </div>
    </div>
  );
}

export default Donations;
