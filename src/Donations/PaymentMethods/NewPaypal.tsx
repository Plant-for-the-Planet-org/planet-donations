import React, { ReactElement, Dispatch, SetStateAction } from "react";
import { useTranslation } from "next-i18next";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import {
  PaymentOptions,
  PaypalApproveData,
  PaypalErrorData,
} from "src/Common/Types";
import { PaymentGateway } from "@planet-sdk/common";

interface Props {
  paymentSetup: PaymentOptions;
  totalAmount: number;
  currency: string;
  donationID: string;
  payDonationFunction: (
    gateway: PaymentGateway,
    method: string,
    providerObject?: PaypalApproveData | PaypalErrorData
  ) => Promise<void>;
  setPaymentError: Dispatch<SetStateAction<string>>;
}

function NewPaypal({
  paymentSetup,
  totalAmount,
  currency,
  donationID,
  payDonationFunction,
  setPaymentError,
}: Props): ReactElement {
  const { t } = useTranslation("common");
  const initialOptions = {
    "client-id": paymentSetup?.gateways.paypal.authorization.client_id,
    "enable-funding": "venmo",
    "disable-funding": "card,giropay,sofort,sepa",
    currency: currency,
  };

  const { donationUid } = React.useContext(QueryParamContext);

  function createOrder(
    _data: Record<string, unknown>,
    actions: CreateOrderActions
  ): Promise<string> {
    const amount = totalAmount.toFixed(2);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
            currency_code: currency,
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

  function onApprove(
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> {
    return actions.order.capture().then(function () {
      // This function shows a transaction success message to your buyer.
      const _data = {
        ...data,
        type: "sdk",
      };
      payDonationFunction("paypal", "paypal", _data);
    });
  }

  const onError = (data: Record<string, unknown>): void => {
    setPaymentError(t("paypalPaymentError"));
    // This function shows a transaction error message to your buyer.
    const _data: Readonly<PaypalErrorData> = {
      ...data,
      type: "sdk",
      status: "error",
      errorMessage: data?.message,
    };
    payDonationFunction("paypal", "paypal", _data);
  };

  const onCancel = (): void => {};

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

function ReloadButton({ currency }: { currency: string }): ReactElement | null {
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
