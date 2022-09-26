import { apiRequest } from "../../Utils/api";
import {
  CreateDonationFunctionProps,
  PayDonationProps,
  HandleStripeSCAPaymentProps,
} from "../../Common/Types";
import { useRouter } from "next/router";
import { THANK_YOU } from "src/Utils/donationStepConstants";

//rename to buildPaymentProviderRequest
export function buildPaymentProviderRequest(
  gateway,
  method,
  paymentSetup,
  providerObject
) {
  let account;
  let source;
  switch (gateway) {
    case "stripe":
      account = paymentSetup.gateways.stripe.account;
      switch (method) {
        case "stripe_cc":
        case "card":
        case "stripe_sepa":
        case "sepa_debit":
          source = {
            id: providerObject.id,
            object: "payment_method",
          };
          break;
        case "stripe_sofort":
        case "sofort":
        case "stripe_giropay":
        case "giropay":
          source = { object: providerObject };
          break;
      }
      break;
    case "paypal":
      account = paymentSetup.gateways.paypal.account;
      source = providerObject;
      break;
    case "offline":
      account = paymentSetup.gateways.offline.account;
      source = {};

    // throw some exception here 'unsupported gateway'
  }
  return {
    paymentProviderRequest: {
      account,
      gateway,
      method,
      source,
    },
  };
}

export function getPaymentType(paymentType: String) {
  let paymentTypeUsed;
  switch (paymentType) {
    case "CARD":
      paymentTypeUsed = "Credit Card";
      break;
    case "SEPA":
      paymentTypeUsed = "SEPA Direct Debit";
      break;
    case "GOOGLE_PAY":
      paymentTypeUsed = "Google Pay";
      break;
    case "APPLE_PAY":
      paymentTypeUsed = "Apple Pay";
      break;
    case "BROWSER":
      paymentTypeUsed = "Browser";
      break;
    default:
      paymentTypeUsed = "Credit Card";
  }
  return paymentTypeUsed;
}

export async function createDonationFunction({
  isTaxDeductible,
  country,
  projectDetails,
  paymentSetup,
  quantity,
  currency,
  contactDetails,
  isGift,
  giftDetails,
  setIsPaymentProcessing,
  setPaymentError,
  setdonationID,
  token,
  setshowErrorCard,
  frequency,
  amount,
  callbackUrl,
  callbackMethod,
  tenant,
}: CreateDonationFunctionProps) {
  const taxDeductionCountry = isTaxDeductible ? country : null;
  const donationData = createDonationData({
    projectDetails,
    quantity,
    paymentSetup,
    currency,
    contactDetails,
    taxDeductionCountry,
    isGift,
    giftDetails,
    frequency,
    amount,
    callbackUrl,
    callbackMethod,
  });
  try {
    const requestParams = {
      url: `/app/donations`,
      data: donationData,
      method: "POST",
      setshowErrorCard,
      tenant,
      token: token ? token : false,
    };
    const donation = await apiRequest(requestParams);
    if (donation && donation.data) {
      setdonationID(donation.data.id);
      return donation.data;
    }
  } catch (error) {
    if (error.status === 400) {
      setPaymentError(error.data.message);
    } else if (error.status === 500) {
      setPaymentError("Something went wrong please try again soon!");
    } else if (error.status === 503) {
      setPaymentError(
        "App is undergoing maintenance, please check status.plant-for-the-planet.org for details"
      );
    } else {
      setPaymentError(error.message);
    }
    setIsPaymentProcessing(false);
  }
}

export function createDonationData({
  projectDetails,
  quantity,
  paymentSetup,
  currency,
  contactDetails,
  taxDeductionCountry,
  isGift,
  giftDetails,
  frequency,
  amount,
  callbackUrl,
  callbackMethod,
}: any) {
  let donationData = {
    purpose: projectDetails?.purpose,
    project: projectDetails.id,
    amount:
      paymentSetup.unitCost * quantity
        ? Math.round(paymentSetup.unitCost * quantity * 100) / 100
        : amount,
    currency,
    donor: { ...contactDetails },
    frequency: frequency,
    metadata: {
      callback_url: callbackUrl,
      callback_method: callbackMethod,
    },
  };
  // if (paymentSetup.unitBased) {
  donationData = {
    ...donationData,
    quantity,
  };
  // }
  if (taxDeductionCountry) {
    donationData = {
      ...donationData,
      taxDeductionCountry,
    };
  }

  if (isGift) {
    if (giftDetails.type === "invitation") {
      donationData = {
        ...donationData,
        ...{
          gift: {
            type: "invitation",
            recipientName: giftDetails.recipientName,
            recipientEmail: giftDetails.recipientEmail,
            message: giftDetails.giftMessage,
          },
        },
      };
    } else if (giftDetails.type === "direct") {
      donationData = {
        ...donationData,
        ...{
          gift: {
            type: "direct",
            recipientTreecounter: giftDetails.recipientTreecounter,
            // message: giftDetails.giftMessage, //A direct gift does not have a message
          },
        },
      };
    } else if (giftDetails.type === "bulk") {
      // for multiple receipients
    }
  }

  if (projectDetails?.purpose === "planet-cash") {
    // For PlanetCash Top-up

    // No need to send quantity.
    delete donationData.quantity;

    // Since a user account can have only one planetCash account no need to send project (i.e planetCash account ID).
    delete donationData.project;
  }

  return donationData;
}

export async function payDonationFunction({
  gateway,
  method,
  providerObject,
  setIsPaymentProcessing,
  setPaymentError,
  t,
  paymentSetup,
  donationID,
  contactDetails,
  token,
  country,
  setshowErrorCard,
  router,
  tenant,
  setTransferDetails,
}: PayDonationProps) {
  // const router = useRouter();
  setIsPaymentProcessing(true);
  if (method !== "offline") {
    if (!providerObject) {
      setIsPaymentProcessing(false);
      setPaymentError(t("donate:noPaymentMethodError"));
      return;
    }
  }

  const payDonationData = buildPaymentProviderRequest(
    gateway,
    method,
    paymentSetup,
    providerObject
  );

  try {
    const paymentResponse = await confirmPaymentIntent(
      donationID,
      payDonationData,
      token,
      setshowErrorCard,
      setPaymentError,
      tenant
    );
    if (paymentResponse) {
      if (
        ["success", "pending", "paid"].includes(
          paymentResponse.paymentStatus
        ) ||
        ["success", "paid", "failed"].includes(paymentResponse.status)
      ) {
        if (paymentResponse.status === "failed") {
          // setIsPaymentProcessing(false);
          setPaymentError(paymentResponse.message);
        }
        // setIsPaymentProcessing(false);
        if (paymentResponse?.response?.type === "transfer_required") {
          setTransferDetails(paymentResponse?.response?.account);
        } else {
          setTransferDetails(null);
        }
        router.replace({
          query: { ...router.query, step: THANK_YOU },
        });

        return paymentResponse;
      } else if (paymentResponse.status === "action_required") {
        handleStripeSCAPayment({
          gateway,
          method,
          paymentResponse,
          paymentSetup,
          window,
          setIsPaymentProcessing,
          setPaymentError,
          donationID,
          contactDetails,
          token,
          country,
          setshowErrorCard,
          router,
          tenant,
        });
      }
    }
  } catch (error) {
    if (error.status === 400 || error.status === 401) {
      setPaymentError(error.data.message);
      return;
    } else if (error.status === 500) {
      setPaymentError("Something went wrong please try again soon!");
      return;
    } else if (error.status === 503) {
      setPaymentError(
        "App is undergoing maintenance, please check status.plant-for-the-planet.org for details"
      );
      return;
    } else {
      setPaymentError(error.message);
    }
    setIsPaymentProcessing(false);
  }
}

export async function confirmPaymentIntent(
  donationId: string,
  // paymentIntentId: string,
  // account: string,
  payDonationData: any,
  token: string,
  setshowErrorCard: any,
  setPaymentError: any,
  tenant: string
) {
  // const payDonationData = {
  //   paymentProviderRequest: {
  //     account: account,
  //     gateway: "stripe",
  //     source: {
  //       id: paymentIntentId,
  //       object: "payment_intent",
  //     },
  //   },
  // };

  const requestParams = {
    url: `/app/donations/${donationId}`,
    data: payDonationData,
    method: "PUT",
    setshowErrorCard,
    token: token ? token : false,
    tenant,
  };
  const confirmationResponse = await apiRequest(requestParams);
  if (
    confirmationResponse.data.paymentStatus ||
    confirmationResponse.data.status
  ) {
    if (confirmationResponse.data.status === "failed") {
      setPaymentError(confirmationResponse.data.message);
    }
    return confirmationResponse.data;
  }
}

const buildBillingDetails = (contactDetails: any) => {
  return {
    name: `${contactDetails.firstname} ${contactDetails.lastname}`,
    email: contactDetails.email,
    address: {
      city: contactDetails.city,
      country: contactDetails.country,
      line1: contactDetails.address,
      postal_code: contactDetails.zipCode,
    },
  };
};

const handlePaymentError = (
  paymentError: any,
  setIsPaymentProcessing: any,
  setPaymentError: any
) => {
  setIsPaymentProcessing(false);
  if (paymentError?.message || paymentError?.data?.message) {
    setPaymentError(paymentError.message ?? paymentError.data.message);
  } else {
    setPaymentError(paymentError);
  }
};

export async function handleStripeSCAPayment({
  method,
  paymentResponse,
  paymentSetup,
  window,
  setIsPaymentProcessing,
  setPaymentError,
  donationID,
  contactDetails,
  token,
  country,
  setshowErrorCard,
  router,
  tenant,
}: HandleStripeSCAPaymentProps) {
  const clientSecret = paymentResponse.response.payment_intent_client_secret;
  const key = paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    : paymentSetup?.gateways?.stripe?.stripePublishableKey;
  const stripe = window.Stripe(key, {
    stripeAccount: paymentResponse.response.account,
  });
  switch (method) {
    case "card": {
      let successData: {};
      let stripeResponse: {};
      switch (paymentResponse.response.type) {
        // cardAction requires confirmation of the payment intent to execute the payment server side
        case "cardAction":
          stripeResponse = await stripe.handleCardAction(clientSecret);
          if (stripeResponse.error) {
            setIsPaymentProcessing(false);
            setPaymentError(stripeResponse.error.message);
            return;
          }
          try {
            const payDonationData = {
              paymentProviderRequest: {
                account: paymentSetup.gateways.stripe.account,
                gateway: "stripe",
                source: {
                  id: stripeResponse.paymentIntent.id,
                  object: "payment_intent",
                },
              },
            };
            const successResponse = confirmPaymentIntent(
              donationID,
              payDonationData,
              token,
              setshowErrorCard,
              setPaymentError,
              tenant
            );
            successData = successResponse.data;
          } catch (error: any) {
            // implement and call an exception handling function
            handlePaymentError(error, setIsPaymentProcessing, setPaymentError);
            return;
          }
          break;
        // cardPayment will execute the payment client side so no confirmation of the payment intent is required
        case "cardPayment":
          stripeResponse = await stripe.confirmCardPayment(clientSecret);
          if (stripeResponse.error) {
            setIsPaymentProcessing(false);
            setPaymentError(stripeResponse.error.message);
            return;
          }
          break;

        default:
          setIsPaymentProcessing(false);
          setPaymentError("Unexpected Payment Type");
      }
      router.push(
        {
          query: { ...router.query, step: THANK_YOU },
        },
        undefined,
        { shallow: true }
      );
      setIsPaymentProcessing(false);
      return successData;
    }
    case "giropay": {
      const { errorGiropay, paymentIntentGiropay } =
        await stripe.confirmGiropayPayment(
          paymentResponse.response.payment_intent_client_secret,
          {
            payment_method: {
              billing_details: buildBillingDetails(contactDetails),
            },
            return_url: `${
              window.location.origin
            }/?context=${donationID}&method=Giropay&tenant=${tenant}&country=${country}&locale=${
              localStorage.getItem("language")
                ? localStorage.getItem("language")
                : "en"
            }`,
          }
        );
      handlePaymentError(errorGiropay, setIsPaymentProcessing, setPaymentError);
      break;
    }

    case "sofort": {
      const { errorSofort, paymentIntentSofort } =
        await stripe.confirmSofortPayment(
          paymentResponse.response.payment_intent_client_secret,
          {
            payment_method: {
              sofort: {
                country: country,
              },
              billing_details: buildBillingDetails(contactDetails),
            },
            return_url: `${
              window.location.origin
            }/?context=${donationID}&method=Sofort&tenant=${tenant}&country=${country}&locale=${
              localStorage.getItem("language")
                ? localStorage.getItem("language")
                : "en"
            }`,
          }
        );
      handlePaymentError(errorSofort, setIsPaymentProcessing, setPaymentError);
      break;
    }
    case "sepa_debit": {
      try {
        const sepaResponse = await stripe.confirmSepaDebitPayment(clientSecret);
      } catch {
        (err: any) => {
          handlePaymentError(err, setIsPaymentProcessing, setPaymentError);
        };
      }
      router.push({
        query: { ...router.query, step: THANK_YOU },
      });
      break;
    }
  }
}
