import React, { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import LeftPanel from "./LeftPanel";
import ContactsForm from "./Components/ContactsForm";
import { QueryParamContext } from "../Layout/QueryParamContext";
import PaymentsForm from "./Components/PaymentsForm";
import DonationsForm from "./Components/DonationsForm";
import PaymentStatus from "./Components/PaymentStatus";
import SelectProject from "./Components/SelectProject";
import {
  CONTACT,
  DONATE,
  PAYMENT,
  SELECT_PROJECT,
  THANK_YOU,
} from "src/Utils/donationStepConstants";

function Donations(): ReactElement {
  const router = useRouter();

  const { donationStep, setdonationStep } = React.useContext(QueryParamContext);

  useEffect(() => {
    if (router.query?.step) {
      let step;
      if (donationStep === 4) {
        //if the last step is 'Thankyou' then this will replace the entire route with the initial one on browser back press
        step = SELECT_PROJECT;
        router.replace({
          query: {},
        });
      } else {
        step = router.query?.step;
      }

      switch (step) {
        case SELECT_PROJECT:
          setdonationStep(0);
          break;
        case DONATE:
          setdonationStep(1);
          break;
        case CONTACT:
          setdonationStep(2);
          break;
        case PAYMENT:
          setdonationStep(3);
          break;
        case THANK_YOU:
          setdonationStep(4);
          break;
        default:
          setdonationStep(0);
      }
    }
    return () => {};
  }, [router.query.step]);
  return (
    <div className="donations-container">
      <div className="donations-card-container">
        {/* Left panel */}
        <LeftPanel />

        {/* Right panel */}
        {donationStep === 0 && <SelectProject />}
        {donationStep === 1 && <DonationsForm />}
        {donationStep === 2 && <ContactsForm />}
        {donationStep === 3 && <PaymentsForm />}
        {donationStep === 4 && <PaymentStatus />}
      </div>
    </div>
  );
}

export default Donations;
