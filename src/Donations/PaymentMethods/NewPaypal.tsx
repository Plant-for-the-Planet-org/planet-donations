import React, { ReactElement } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { QueryParamContext } from "../../Layout/QueryParamContext";

interface Props {
  paymentSetup: any;
  quantity: number;
  unitCost: number;
  currency: string;
  donationID: any;
  payDonationFunction: Function;
  setPaymentError: Function;
}

function NewPaypal({
  paymentSetup,
  quantity,
  unitCost,
  currency,
  donationID,
  payDonationFunction,
  setPaymentError,
}: Props): ReactElement {
  const initialOptions = {
    "client-id": paymentSetup?.gateways.paypal.authorization.client_id,
    "enable-funding": "venmo,giropay,sofort",
    "disable-funding": "card",
    currency: currency,
  };

  const { donationUid } = React.useContext(QueryParamContext);

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (paymentSetup.unitBased
              ? quantity * unitCost
              : quantity
            ).toFixed(2),
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

  function onApprove(data, actions) {
    console.log(`data onApprove`, data);
    console.log(`actions onApprove`, actions);

    return actions.order.capture().then(function (details) {
      console.log(`actions.order details onApprove`, details);
      // This function shows a transaction success message to your buyer.
      data = {
        ...data,
        type: "sdk",
      };
      payDonationFunction("paypal", "paypal", data);
    });
  }

  const onError = (data) => {
    console.log(`data onError`, data);
    setPaymentError(`Your order ${data.orderID} failed due to some error.`);

    // This function shows a transaction success message to your buyer.
    data = {
      ...data,
      type: "sdk",
      status: "error",
    };
    payDonationFunction("paypal", "paypal", data);
  };

  const onCancel = (data, actions) => {
    console.log(`data onCancel`, data);
    console.log(`actions onCancel`, actions);

    setPaymentError("Order was cancelled, please try again");

    return actions.order.capture().then(function (details) {
      console.log(`actions.order details onCancel`, details);
      // This function shows a transaction success message to your buyer.
      data = {
        ...data,
        type: "sdk",
        status: "cancel",
      };
      payDonationFunction("paypal", "paypal", data);
    });
  };

  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <ReloadButton currency={currency} />
        <PayPalButtons
          createOrder={createOrder}
          onError={onError}
          onApprove={onApprove}
          onCancel={onCancel}
        />
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
