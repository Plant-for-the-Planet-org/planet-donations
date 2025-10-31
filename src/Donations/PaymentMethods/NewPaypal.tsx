import React, {
  ReactElement,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  useEffect,
} from "react";
import { useTranslation } from "next-i18next";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  ReactPayPalScriptOptions,
  PayPalButtonsComponentProps,
  DISPATCH_ACTION,
} from "@paypal/react-paypal-js";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import {
  PaymentOptions,
  PaypalApproveData,
  PaypalErrorData,
} from "src/Common/Types";
import { PaymentGateway } from "@planet-sdk/common";
import { apiRequest, ExtendedRequestParams } from "../../Utils/api";

type PayPalOrderStatus =
  | "CREATED"
  | "SAVED"
  | "APPROVED"
  | "VOIDED"
  | "COMPLETED"
  | "PAYER_ACTION_REQUIRED";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type PaypalLinkRel =
  | "self"
  | "approve"
  | "update"
  | "capture"
  | "authorize"
  | "payer-action";

type PaypalLink = {
  href: string;
  rel: PaypalLinkRel | string;
  method: HttpMethod;
};

type PaypalOrderData = {
  orderId: string;
  status: PayPalOrderStatus;
  approvalUrl: string;
  links: PaypalLink[];
};

interface Props {
  paymentSetup: PaymentOptions;
  currency: string;
  payDonationFunction: (
    gateway: PaymentGateway,
    method: string,
    providerObject?: PaypalApproveData | PaypalErrorData,
  ) => Promise<void>;
  setPaymentError: Dispatch<SetStateAction<string>>;
}

function NewPaypal({
  paymentSetup,
  currency,
  payDonationFunction,
  setPaymentError,
}: Props): ReactElement {
  const { t, i18n } = useTranslation("common");
  const [isProcessing, setIsProcessing] = useState(false);

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: paymentSetup?.gateways.paypal.authorization.client_id,
    enableFunding: "venmo",
    disableFunding: "card,giropay,sofort,sepa",
    currency: currency,
  };

  const { donationID, donationUid, tenant, setShowErrorCard } =
    useContext(QueryParamContext);

  const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
    // Note: not setting isProcessing here as the PayPal SDK handles button state
    try {
      if (!donationID) {
        throw new Error("Donation ID is missing");
      }

      if (!paymentSetup?.gateways?.paypal?.account) {
        throw new Error("PayPal account configuration is missing");
      }

      const requestParams: ExtendedRequestParams = {
        url: `/app/donations/${donationID}/paypal/orders`,
        // url: `/app/donations/${donationUid}/paypal/orders`,
        method: "POST" as const,
        data: {
          paymentRequest: {
            account: paymentSetup.gateways.paypal.account,
            gateway: "paypal",
            method: "paypal",
            savePaymentMethod: true,
          },
        },
        setShowErrorCard,
        tenant,
        locale: i18n.language,
      };

      const response = await apiRequest(requestParams);
      const orderData: PaypalOrderData = response.data;

      if (!orderData?.orderId) {
        throw new Error("Invalid response from server - missing order ID");
      }

      return orderData.orderId;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      setPaymentError(t("paypalOrderCreationError"));
      throw error;
    }
  };

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data) => {
    try {
      setIsProcessing(true);

      // Log the approval data to verify orderID is present. TODO: remove before release
      console.log("PayPal approval data:", data);

      // Ensure we have the order ID
      if (!data.orderID) {
        throw new Error("Order ID missing from PayPal approval data");
      }

      // Create the approval data object that matches the expected format
      const paypalApprovalData: PaypalApproveData = {
        ...data,
        type: "server_order",
      };

      // TODO: remove before release
      console.log(
        "Sending PayPal approval data to backend:",
        paypalApprovalData,
      );

      // Let payDonationFunction handle the capture, routing, and success flow
      await payDonationFunction("paypal", "paypal", paypalApprovalData);
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      setPaymentError(t("paypalCaptureError"));

      // Call payment function with error data for logging/tracking
      const errorData: PaypalErrorData = {
        ...data,
        type: "server_order",
        status: "error",
        errorMessage:
          error instanceof Error ? error.message : "Payment capture failed",
      };

      try {
        await payDonationFunction("paypal", "paypal", errorData);
      } catch (loggingError) {
        console.error("Failed to update donation status:", loggingError);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const onError: PayPalButtonsComponentProps["onError"] = (err) => {
    setPaymentError(t("paypalPaymentError") || "PayPal payment error occurred");
    // This function shows a transaction error message to your buyer.
    const _data: Readonly<PaypalErrorData> = {
      ...err,
      type: "server_order",
      status: "error",
      errorMessage: err?.message || "PayPal SDK error",
    };
    payDonationFunction("paypal", "paypal", _data);
  };

  const onCancel: PayPalButtonsComponentProps["onCancel"] = () => {
    setIsProcessing(false);
  };

  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <ReloadButton currency={currency} />
        {isProcessing && (
          <div
            className="paypal-processing-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div className="spinner" />
          </div>
        )}
        <PayPalButtons
          createOrder={createOrder}
          onError={onError}
          onApprove={onApprove}
          onCancel={onCancel}
          disabled={isProcessing}
        />
      </PayPalScriptProvider>
    </>
  );
}

function ReloadButton({ currency }: { currency: string }): ReactElement | null {
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: DISPATCH_ACTION.RESET_OPTIONS,
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, dispatch]);

  return isPending ? <div className="spinner" /> : null;
}

export default NewPaypal;
