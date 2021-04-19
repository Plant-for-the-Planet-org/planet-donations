import React, { ReactElement, useState } from "react";
import ContactsForm from "./Components/ContactsForm";

import { QueryParamContext } from "../Layout/QueryParamContext";
import PaymentsForm from "./Components/PaymentsForm";
import DonationsForm from "./Components/DonationsForm";

interface Props {}

function Donations({}: Props): ReactElement {
  const { paymentSetup, donationStep,projectDetails } = React.useContext(QueryParamContext);

  return paymentSetup ? (
    <div className="donations-container">
      <div className="donations-card-container">
        <div className="donations-info-container">
          <p className="title-text donations-project-name">
            {projectDetails.name}
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
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Donations;
