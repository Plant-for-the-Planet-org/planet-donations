import React, { ReactElement, Dispatch, SetStateAction, useState } from "react";
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
import { apiRequest } from "../../Utils/api";

interface Props {
  paymentSetup: PaymentOptions;
  quantity: number;
  unitCost: number;
  currency: string;
  donationID: string;
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
  const [showErrorCard, setShowErrorCard] = useState(false);
  
  const initialOptions = {
    "client-id": paymentSetup?.gateways.paypal.authorization.client_id,
    "enable-funding": "venmo",
    "disable-funding": "card,giropay,sofort,sepa",
    currency: currency,
  };

  const { donationUid, tenant } = React.useContext(QueryParamContext);

  async function createOrder(
    _data: Record<string, unknown>,
    actions: CreateOrderActions,
  ): Promise<string> {
    try {
      setIsProcessing(true);
      
      const requestParams = {
        url: `/app/donations/${donationUid}/paypal/orders`,
        method: "POST" as const,
        data: {
          paymentRequest: {
            account: paymentSetup?.gateways.paypal.account,
            gateway: "paypal",
            method: "paypal"
          }
        },
        setshowErrorCard: setShowErrorCard,
        tenant,
        locale: i18n.language,
      };

      const response = await apiRequest(requestParams);
      const orderData = response.data;
      
      if (!orderData.orderId) {
        throw new Error('Invalid response from server');
      }

      return orderData.orderId;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      setPaymentError(t("paypalOrderCreationError") || "Failed to create PayPal order");
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }

  async function onApprove(
    data: OnApproveData,
    actions: OnApproveActions,
  ): Promise<void> {
    try {
      setIsProcessing(true);
      
      // Log the approval data to verify orderID is present
      console.log('PayPal approval data:', data);
      
      // Ensure we have the order ID
      if (!data.orderID) {
        throw new Error('Order ID missing from PayPal approval data');
      }
      
      // Create the PayPal approval data object that matches the expected format
      const paypalApprovalData: PaypalApproveData = {
        ...data,
        type: "server_order",
      };
      
      console.log('Sending PayPal approval data to backend:', paypalApprovalData);
      
      const requestParams = {
        url: `/app/donations/${donationUid}`,
        method: "PUT" as const,
        data: {
          paymentRequest: {
            account: paymentSetup?.gateways.paypal.account,
            gateway: "paypal",
            method: "paypal",
            source: paypalApprovalData
          }
        },
        setshowErrorCard: setShowErrorCard,
        tenant,
        locale: i18n.language,
      };

      console.log('Payment request params:', requestParams);

      const response = await apiRequest(requestParams);
      const captureData = response.data;
      
      console.log('Backend response:', captureData);
      
      if (captureData.status !== 'success') {
        throw new Error(`Payment capture failed: ${captureData.message || 'Unknown error'}`);
      }

      // Success - call the payment function with server response data
      await payDonationFunction("paypal", "paypal", paypalApprovalData);
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      setPaymentError(t("paypalCaptureError") || "Failed to complete PayPal payment");
      
      // Call payment function with error data
      const errorData: PaypalErrorData = {
        ...data,
        type: "server_order",
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Payment capture failed",
      };
      
      await payDonationFunction("paypal", "paypal", errorData);
    } finally {
      setIsProcessing(false);
    }
  }

  const onError = (data: Record<string, unknown>): void => {
    setPaymentError(t("paypalPaymentError") || "PayPal payment error occurred");
    // This function shows a transaction error message to your buyer.
    const _data: Readonly<PaypalErrorData> = {
      ...data,
      type: "server_order",
      status: "error",
      errorMessage: data?.message || "PayPal SDK error",
    };
    payDonationFunction("paypal", "paypal", _data);
  };

  const onCancel = (): void => {
    setIsProcessing(false);
  };

  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <ReloadButton currency={currency} />
        {isProcessing && (
          <div className="paypal-processing-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
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
