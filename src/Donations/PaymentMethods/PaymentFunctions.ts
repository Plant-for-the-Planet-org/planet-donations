import { apiRequest } from "../../Utils/api";
import { CreateDonationFunctionProps } from "../../Common/Types";
import { useRouter } from "next/router";

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

    if (token) {
      const requestParams = {
        url: `/app/donations`,
        data: donationData,
        method: "POST",
        setshowErrorCard,
        token: token,
      };
      donation = await apiRequest(requestParams);
    } else {
      const requestParams = {
        url: `/app/donations`,
        data: donationData,
        method: "POST",
        setshowErrorCard,
      };
      donation = await apiRequest(requestParams);
    }
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
    let paidDonation;
    if (token) {
      const requestParams = {
        url: `/app/donations/${donationID}`,
        data: payDonationData,
        method: "PUT",
        setshowErrorCard,
        token: token,
      };
      paidDonation = await apiRequest(requestParams);
    } else {
      const requestParams = {
        url: `/app/donations/${donationID}`,
        data: payDonationData,
        method: "PUT",
        setshowErrorCard,
      };
      paidDonation = await apiRequest(requestParams);
    }
    if (paidDonation && paidDonation.data) {
      // if (paidDonation.data.status === "failed") {
      //   setIsPaymentProcessing(false);
      //   setPaymentError(paidDonation.data.message);
      // } else
      if (
        paidDonation.data.paymentStatus === "success" ||
        paidDonation.data.paymentStatus === "pending" ||
        paidDonation.data.status === "success" ||
        paidDonation.data.status === "paid" ||
        paidDonation.data.paymentStatus === "paid" ||
        paidDonation.data.status === "failed"
      ) {
        // setIsPaymentProcessing(false);
        router.replace({
          query: { ...router.query, step: "thankyou" },
        });
        // setdonationStep(4);

        return paidDonation.data;
      } else if (paidDonation.data.status === "action_required") {
        handleStripeSCAPayment({
          gateway,
          method,
          paymentResponse: paidDonation.data,
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
  paymentIntentId: string,
  account: string,
  token: string,
  setshowErrorCard: any
) {
  const payDonationData = {
    paymentProviderRequest: {
      account: account,
      gateway: "stripe",
      source: {
        id: paymentIntentId,
        object: "payment_intent",
      },
    },
  };

  let confirmationResponse;
  const requestParams = {
    url: `/app/donations/${donationId}`,
    data: payDonationData,
    method: "PUT",
    setshowErrorCard,
    token: token ? token : null,
  };
  confirmationResponse = await apiRequest(requestParams);

  if (
    confirmationResponse.data.paymentStatus ||
    confirmationResponse.data.status
  ) {
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

  // const router = useRouter();
  switch (method) {
    case "card":
      let stripeResponse;
      let successData;
      switch (paymentResponse.type) {
        // cardAction requires confirmation of the payment intent to execute the payment server side
        case "cardAction":
          stripeResponse = await stripe.handleCardAction(clientSecret);
          if (stripeResponse.error) {
            setIsPaymentProcessing(false);
            setPaymentError(stripeResponse.error.message);
            return;
          }

          try {
            let successResponse = confirmPaymentIntent(
              donationID,
              stripeResponse.paymentIntent.id,
              paymentSetup.gateways.stripe.account,
              token,
              setshowErrorCard
            );
            successData = successResponse.data;
          } catch (e) {
            // implement and call an exception handling function
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
        // unexpected type
      }

      router.push({
        query: { ...router.query, step: "thankyou" },
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
      // handleError(errorGiropay);
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
      // handleError(errorSofort);
      break;
  }
}
