import React, { ReactElement } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import { useTranslation } from "next-i18next";

interface Props {
  paymentSetup: any;
  quantity: number;
  unitCost: number;
  currency: string;
  donationID: any;
  paypalPlan: string;
  payDonationFunction: Function;
  setPaymentError: Function;
}

function NewPaypal({
  paymentSetup,
  quantity,
  unitCost,
  currency,
  donationID,
  paypalPlan,
  payDonationFunction,
  setPaymentError,
}: Props): ReactElement {
  const { donationUid, frequency } = React.useContext(QueryParamContext);
  const { t } = useTranslation(["common"]);

  const initialOptions = {
    "client-id": paymentSetup?.gateways.paypal.authorization.client_id,
    "enable-funding": "venmo,giropay,sofort",
    "disable-funding": "card",
    currency: currency,
    intent: frequency !== "once" ? "subscription" : "capture",
    vault: frequency !== "once" ? true : false,
  };

  function createOrder(data, actions) {
    const amount = paymentSetup.unitBased
      ? (quantity * unitCost).toFixed(2)
      : quantity.toFixed(2);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: Number(amount),
            currency: currency,
          },
          invoice_id: `planet-${donationID}`,
          custom_id: donationUid,
        },
      ],
      application_context: {
        brand_name: "Plant-for-the-Planet",
      },
    });
  }
  function createSubscription(data, actions) {
    return actions.subscription.create({
      plan_id: paypalPlan,
      custom_id: donationUid,
    });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(function (details) {
      // This function shows a transaction success message to your buyer.
      data = {
        ...data,
        type: "sdk",
      };
      payDonationFunction("paypal", "paypal", data);
    });
  }
  function onApproveSubscription(data, actions) {
    // This function shows a transaction success message to your buyer.
    data = {
      ...data,
      type: "sdk",
    };
    payDonationFunction("paypal", "paypal", data);
  }
  const onError = (data) => {
    setPaymentError(t("orderFailedError"));
    // This function shows a transaction success message to your buyer.
    data = {
      ...data,
      type: "sdk",
      status: "error",
      errorMessage: data?.message,
    };
    payDonationFunction("paypal", "paypal", data);
  };

  const onCancel = (data, actions) => {
    setPaymentError("Order was cancelled, please try again");

    // This function shows a transaction success message to your buyer.
    data = {
      ...data,
      type: "sdk",
      status: "cancel",
    };
    payDonationFunction("paypal", "paypal", data);
  };

  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <ReloadButton currency={currency} paypalPlan={paypalPlan} />
        {frequency === "once" ? (
          <PayPalButtons
            createOrder={createOrder}
            onError={onError}
            onApprove={onApprove}
            onCancel={onCancel}
          />
        ) : (
          <PayPalButtons
            createSubscription={createSubscription}
            onError={onError}
            onApprove={onApproveSubscription}
            onCancel={onCancel}
          />
        )}
      </PayPalScriptProvider>
    </>
  );
}

function ReloadButton({ currency }: any) {
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

  React.useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency]);

  return isPending ? <div className="spinner" /> : null;
}

export default NewPaypal;
