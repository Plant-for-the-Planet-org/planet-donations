import React, { ReactElement, useState } from "react";
import ContactsForm from "./Components/ContactsForm";

import { QueryParamContext } from "../Layout/QueryParamContext";
import PaymentsForm from "./Components/PaymentsForm";
import DonationsForm from "./Components/DonationsForm";
import { useTranslation } from "react-i18next";
import ThankYou from "./Components/ThankYouComponent";

interface Props {}

function Donations({}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation("common");
  const { paymentSetup, donationStep, projectDetails } = React.useContext(
    QueryParamContext
  );

  return paymentSetup && projectDetails ? (
    <div className="donations-container">
      
      <div className="donations-card-container">
        <div className="donations-info-container">
          <p className="title-text text-white">{projectDetails.name}</p>
          <p className="text-white">
            {t("byOrganization", {
              organizationName: projectDetails.tpo.name,
            })}
          </p>
          <div className="donations-info"></div>
          <div className="donations-transaction-details">
            <p>Transaction ID - 3343FDFD3434</p>
            <p>This donation is processed by Plant-for-the-Planet</p>
          </div>
        </div>
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

export default Donations;
