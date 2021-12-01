import { apiRequest } from "../../Utils/api";
import { CreateDonationFunctionProps } from "../../Common/Types";
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
    default:
    // throw some exception here 'unsupported gateway'
  }
  return {
    paymentProviderRequest: {
      account: account,
      gateway: gateway,
      source: source,
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
  unitCost,
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
}: CreateDonationFunctionProps) {
  const taxDeductionCountry = isTaxDeductible ? country : null;
  const donationData = createDonationData({
    projectDetails,
    quantity,
    unitCost,
    currency,
    contactDetails,
    taxDeductionCountry,
    isGift,
    giftDetails,
    frequency,
  });
  try {
    let donation;
    const requestParams = {
      url: `/app/donations`,
      data: donationData,
      method: "POST",
      setshowErrorCard,
      token: token ? token : false,
    };
    donation = await apiRequest(requestParams);
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
  unitCost,
  currency,
  contactDetails,
  taxDeductionCountry,
  isGift,
  giftDetails,
  frequency,
}: any) {
  let donationData = {
    purpose: projectDetails.purpose,
    project: projectDetails.id,
    amount: Math.round((unitCost * quantity + Number.EPSILON) * 100) / 100,
    currency,
    donor: { ...contactDetails },
    frequency: frequency === "once" ? null : frequency,
  };
  if (projectDetails.purpose !== "bouquet") {
    donationData = {
      ...donationData,
      quantity,
    };
  }
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
            message: giftDetails.giftMessage,
          },
        },
      };
    } else if (giftDetails.type === "bulk") {
      // for multiple receipients
    }
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
  setdonationStep,
  contactDetails,
  token,
  country,
  setshowErrorCard,
  router,
  tenant,
  frequency,
}: any) {
  // const router = useRouter();
  setIsPaymentProcessing(true);
  if (!providerObject) {
    setIsPaymentProcessing(false);
    setPaymentError(t("donate:noPaymentMethodError"));
    return;
  }

  const payDonationData = buildPaymentProviderRequest(
    gateway,
    method,
    paymentSetup,
    providerObject
  );

  try {
    let paymentResponse = await confirmPaymentIntent(
      donationID,
      payDonationData,
      token,
      setshowErrorCard,
      setPaymentError
    );
    if (paymentResponse && paymentResponse.data) {
      if (
        ["success", "pending", "paid"].includes(
          paymentResponse.data.paymentStatus
        ) ||
        ["success", "paid", "failed"].includes(paymentResponse.data.status)
      ) {
        if (paymentResponse.data.status === "failed") {
          setIsPaymentProcessing(false);
          setPaymentError(paymentResponse.data.message);
        }
        router.replace({
          query: { ...router.query, step: THANK_YOU },
        });

        return paymentResponse.data;
      } else if (paymentResponse.data.status === "action_required") {
        handleStripeSCAPayment({
          gateway,
          method,
          paymentResponse: paymentResponse.data,
          paymentSetup,
          window,
          setIsPaymentProcessing,
          setPaymentError,
          donationID,
          setdonationStep,
          contactDetails,
          token,
          country,
          setshowErrorCard,
          router,
          tenant,
          frequency,
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
  setPaymentError: any
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

  let confirmationResponse;
  const requestParams = {
    url: `/app/donations/${donationId}`,
    data: payDonationData,
    method: "PUT",
    setshowErrorCard,
    token: token ? token : false,
  };
  confirmationResponse = await apiRequest(requestParams);
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
  if (paymentError.message || paymentError.data.message) {
    setPaymentError(paymentError.message ?? paymentError.data.message);
  } else {
    setPaymentError(paymentError);
  }
};

export async function handleStripeSCAPayment({
  gateway,
  method,
  paymentResponse,
  paymentSetup,
  window,
  setIsPaymentProcessing,
  setPaymentError,
  donationID,
  setdonationStep,
  contactDetails,
  token,
  country,
  setshowErrorCard,
  router,
  tenant,
  frequency,
}: any) {
  const clientSecret = paymentResponse.response.payment_intent_client_secret;
  const key = paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    : paymentSetup?.gateways?.stripe?.stripePublishableKey;
  const stripe = window.Stripe(key, {
    stripeAccount: paymentResponse.response.account,
  });
  switch (method) {
    case "card":
      let stripeResponse;
      let successData;
      console.log(paymentResponse, "paymentResponse.type");
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
            let successResponse = confirmPaymentIntent(
              donationID,
              payDonationData,
              token,
              setshowErrorCard,
              setPaymentError
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
      router.push({
        query: { ...router.query, step: THANK_YOU },
      });
      setIsPaymentProcessing(false);
      return successData;

    case "giropay":
      const { errorGiropay, paymentIntentGiropay } =
        await stripe.confirmGiropayPayment(
          paymentResponse.response.payment_intent_client_secret,
          {
            payment_method: {
              billing_details: buildBillingDetails(contactDetails),
            },
            return_url: `${window.location.origin}/?context=${donationID}&method=Giropay&tenant=${tenant}`,
          }
        );
      handlePaymentError(errorGiropay, setIsPaymentProcessing, setPaymentError);
      break;

    case "sofort":
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
            return_url: `${window.location.origin}/?context=${donationID}&method=Giropay&tenant=${tenant}`,
          }
        );
      handlePaymentError(errorSofort, setIsPaymentProcessing, setPaymentError);
      break;
  }
}
