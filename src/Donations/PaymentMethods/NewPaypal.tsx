import React, { ReactElement } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

interface Props {
  paymentSetup: any;
  treeCount: number;
  treeCost: number;
  currency: string;
  donationID: any;
  payDonationFunction: Function;
}

function NewPaypal({
  paymentSetup,
  treeCount,
  treeCost,
  currency,
  donationID,
  payDonationFunction,
}: Props): ReactElement {
  const initialOptions = {
    "client-id": paymentSetup?.gateways.paypal.authorization.client_id,
    "enable-funding": "venmo,giropay,sofort",
    "disable-funding": "card",
    currency: currency,
  };
  //   const [state, setstate] = useState(initialState)

  console.log("paymentSetup?.gateways", paymentSetup?.gateways);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: treeCount * treeCost,
              currency: currency,
            },
            invoice_id: `planet-${donationID}`,
          },
        ],
        application_context: {
          brand_name: "Plant-for-the-Planet",
        },
      })
      .then((data) => {
        console.log("new data", data);
      });
  }

  function onApprove(data, actions) {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(function (details) {
      console.log("details", details);
      console.log("data", data);

      // This function shows a transaction success message to your buyer.
      payDonationFunction("paypal", data);
    });
  }

  const onError = (data) => {
    payDonationFunction("paypal", data);
  };

  const onCancel = (data) => {
    let error = {
      ...data,
      type: "error",
      error: { message: "Transaction cancelled" },
    };
    payDonationFunction("paypal", error);
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

// https://www.sandbox.paypal.com/smart/buttons?style.layout=vertical&style.color=gold&style.shape=rect&style.tagline=false&components.0=buttons&locale.country=GB&locale.lang=en&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWwuY29tL3Nkay9qcz9jbGllbnQtaWQ9QVZNOE91TFZIUEpKRkFCSFFkWGRybVYwUVpVNWpTMHdfQVl0TXppalZxbTFldGZsS1lwS1hkUW9xTVVYNWI1bVFxSHJSaEtCR19vS1BiNWkmZW5hYmxlLWZ1bmRpbmc9dmVubW8sZ2lyb3BheSxzb2ZvcnQmZGlzYWJsZS1mdW5kaW5nPWNhcmQmY3VycmVuY3k9RVVSIiwiYXR0cnMiOnsiZGF0YS11aWQiOiJ1aWRfeGNlcXlkeGhqYnhuYmtxc2FxY2xia21wcmpmdGprIn19&clientID=AVM8OuLVHPJJFABHQdXdrmV0QZU5jS0w_AYtMzijVqm1etflKYpKXdQoqMUX5b5mQqHrRhKBG_oKPb5i&sdkCorrelationID=9a284836557ea&storageID=uid_6b4b80bba1_mdg6ndk6ndk&sessionID=uid_fc949cdd8f_mta6mzi6ntm&buttonSessionID=uid_63f93d8b86_mta6ndm6nte&env=sandbox&fundingEligibility=eyJwYXlwYWwiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6ZmFsc2V9LCJwYXlsYXRlciI6eyJlbGlnaWJsZSI6ZmFsc2UsInByb2R1Y3RzIjp7InBheUluNCI6eyJlbGlnaWJsZSI6ZmFsc2V9fX0sImNhcmQiOnsiZWxpZ2libGUiOmZhbHNlLCJicmFuZGVkIjp0cnVlLCJpbnN0YWxsbWVudHMiOmZhbHNlLCJ2ZW5kb3JzIjp7InZpc2EiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6dHJ1ZX0sIm1hc3RlcmNhcmQiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6dHJ1ZX0sImFtZXgiOnsiZWxpZ2libGUiOnRydWUsInZhdWx0YWJsZSI6dHJ1ZX0sImRpc2NvdmVyIjp7ImVsaWdpYmxlIjpmYWxzZSwidmF1bHRhYmxlIjp0cnVlfSwiaGlwZXIiOnsiZWxpZ2libGUiOmZhbHNlLCJ2YXVsdGFibGUiOmZhbHNlfSwiZWxvIjp7ImVsaWdpYmxlIjpmYWxzZSwidmF1bHRhYmxlIjp0cnVlfSwiamNiIjp7ImVsaWdpYmxlIjpmYWxzZSwidmF1bHRhYmxlIjp0cnVlfX19LCJ2ZW5tbyI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJpdGF1Ijp7ImVsaWdpYmxlIjpmYWxzZX0sImNyZWRpdCI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJzZXBhIjp7ImVsaWdpYmxlIjpmYWxzZX0sImlkZWFsIjp7ImVsaWdpYmxlIjpmYWxzZX0sImJhbmNvbnRhY3QiOnsiZWxpZ2libGUiOmZhbHNlfSwiZ2lyb3BheSI6eyJlbGlnaWJsZSI6dHJ1ZX0sImVwcyI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJzb2ZvcnQiOnsiZWxpZ2libGUiOnRydWV9LCJteWJhbmsiOnsiZWxpZ2libGUiOmZhbHNlfSwicDI0Ijp7ImVsaWdpYmxlIjpmYWxzZX0sInppbXBsZXIiOnsiZWxpZ2libGUiOmZhbHNlfSwid2VjaGF0cGF5Ijp7ImVsaWdpYmxlIjpmYWxzZX0sInBheXUiOnsiZWxpZ2libGUiOmZhbHNlfSwiYmxpayI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJ0cnVzdGx5Ijp7ImVsaWdpYmxlIjpmYWxzZX0sIm94eG8iOnsiZWxpZ2libGUiOmZhbHNlfSwibWF4aW1hIjp7ImVsaWdpYmxlIjpmYWxzZX0sImJvbGV0byI6eyJlbGlnaWJsZSI6ZmFsc2V9LCJtZXJjYWRvcGFnbyI6eyJlbGlnaWJsZSI6ZmFsc2V9fQ&platform=desktop&experiment.enableVenmo=true&flow=purchase&currency=EUR&intent=capture&commit=true&vault=false&enableFunding.0=venmo&enableFunding.1=giropay&enableFunding.2=sofort&disableFunding.0=card&debug=false&applePaySupport=false&supportsPopups=true&supportedNativeBrowser=false
