import React, { ReactElement } from "react";
import Paypal from "./Paypal";
import { paypalCurrencies } from "./../../Utils/paypalCurrencies";
function PaypalPayments({
  paymentSetup,
  treeCount,
  treeCost,
  currency,
  donationID,
  payDonationFunction,
}: any): ReactElement {
  return (
    <div>
      {paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal && (
        <div className={"paymentModeContainer"}>
          <Paypal
            onSuccess={(data) => {
              payDonationFunction("paypal", data);
            }}
            amount={treeCost * treeCount}
            currency={currency}
            donationId={donationID}
            mode={
              paymentSetup?.gateways.paypal.isLive ? "production" : "sandbox"
            }
            clientID={paymentSetup?.gateways.paypal.authorization.client_id}
          />
        </div>
      )}
    </div>
  );
}

export default PaypalPayments;
