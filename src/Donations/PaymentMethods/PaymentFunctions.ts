import { apiRequest } from "../../Utils/api";
import {
  CreateDonationFunctionProps,
  PayDonationProps,
  HandleStripeSCAPaymentProps,
  PaymentOptions,
  CreateDonationDataProps,
  PaypalErrorData,
  PaypalApproveData,
  PaymentProviderRequest,
  UpdateDonationResponse,
  UpdateDonationData,
} from "../../Common/Types";
import { THANK_YOU } from "src/Utils/donationStepConstants";
import {
  Donation,
  ContactDetails,
  PaymentGateway,
} from "@planet-sdk/common/build/types/donation";
import { DonationRequestData } from "src/Common/Types/donation";
import { PaymentMethod } from "@stripe/stripe-js/types/api/payment-methods";
import { PaymentIntentResult, Stripe, StripeError } from "@stripe/stripe-js";
import { Dispatch, SetStateAction } from "react";

export function buildPaymentProviderRequest(
  gateway: PaymentGateway,
  method: string,
  paymentSetup: PaymentOptions,
  providerObject?: string | PaymentMethod | PaypalApproveData | PaypalErrorData
): { paymentProviderRequest: PaymentProviderRequest } {
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
            id: (providerObject as PaymentMethod).id,
            object: "payment_method",
          };
          break;
        case "stripe_giropay":
        case "giropay":
          source = { object: providerObject };
          break;
      }
      break;
    case "paypal":
      account = paymentSetup.gateways.paypal.account;
      source = providerObject as PaypalApproveData | PaypalErrorData;
      break;
    case "offline":
      account = paymentSetup.gateways.offline?.account;
      source = {};
      break;
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

export function getPaymentType(paymentType: string): string {
  let paymentTypeUsed: string;
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
  utmCampaign,
  utmMedium,
  utmSource,
  isPackageWanted = false,
  tenant,
  locale,
}: CreateDonationFunctionProps): Promise<Donation | undefined> {
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
    utmCampaign,
    utmMedium,
    utmSource,
    isPackageWanted,
  });
  try {
    const requestParams = {
      url: `/app/donations`,
      data: donationData,
      method: "POST" as const,
      setshowErrorCard,
      tenant,
      locale,
      token: token ? token : null,
      headers: {
        "X-Locale": locale,
      },
    };
    const donation = await apiRequest(requestParams);
    if (donation && donation.data) {
      setdonationID(donation.data.id);
      return donation.data as Donation;
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
  utmCampaign,
  utmMedium,
  utmSource,
  isPackageWanted,
}: CreateDonationDataProps): DonationRequestData {
  const sanitizedDonor = {
    ...contactDetails,
  };
  if ("isPackageWanted" in sanitizedDonor) {
    delete sanitizedDonor.isPackageWanted;
  }

  let donationData: DonationRequestData = {
    purpose: projectDetails?.purpose,
    project: projectDetails.id,
    amount:
      paymentSetup.unitCost * quantity
        ? Math.round(paymentSetup.unitCost * quantity * 100) / 100
        : (amount as number), //amount is null when quantity has a value
    currency,
    donor: sanitizedDonor,
    frequency: frequency,
    metadata: {
      callback_url: callbackUrl,
      callback_method: callbackMethod,
      utm_campaign: utmCampaign,
      utm_medium: utmMedium,
      utm_source: utmSource,
      ...(isPackageWanted === true && { welcomePackageStatus: "draft" }),
    },
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
            message: giftDetails.message,
          },
        },
      };
    } else if (giftDetails.type === "direct") {
      donationData = {
        ...donationData,
        ...{
          gift: {
            type: "direct",
            recipient: giftDetails.recipient,
          },
        },
      };
    }
  }

  if (projectDetails?.purpose === "planet-cash") {
    // For PlanetCash Top-up

    // No need to send quantity.
    delete donationData.quantity;

    // Since a user account can have only one planetCash account no need to send project (i.e planetCash account ID).
    delete donationData.project;

    //should not send gift details
    delete donationData.gift;
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
  locale,
  setTransferDetails,
}: PayDonationProps): Promise<UpdateDonationData | undefined> {
  setIsPaymentProcessing(true);
  if (method !== "offline") {
    if (!providerObject) {
      setIsPaymentProcessing(false);
      setPaymentError(t("donate:noPaymentMethodError") as string);
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
      tenant,
      locale
    );
    if (paymentResponse) {
      if (
        (paymentResponse.paymentStatus &&
          ["success", "pending", "paid"].includes(
            paymentResponse.paymentStatus
          )) ||
        ["success", "paid", "failed"].includes(paymentResponse.status)
      ) {
        if (paymentResponse.status === "failed") {
          // setIsPaymentProcessing(false);
          setPaymentError(paymentResponse.message);
        }
        // setIsPaymentProcessing(false);
        if (
          paymentResponse.status === "success" &&
          paymentResponse?.response?.type === "transfer_required"
        ) {
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
          locale,
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
  payDonationData: { paymentProviderRequest: PaymentProviderRequest },
  token: string | null,
  setshowErrorCard: Dispatch<SetStateAction<boolean>>,
  setPaymentError: Dispatch<SetStateAction<string>>,
  tenant: string,
  locale: string
): Promise<UpdateDonationData | undefined> {
  const requestParams = {
    url: `/app/donations/${donationId}`,
    data: payDonationData,
    method: "PUT" as const,
    setshowErrorCard,
    token: token ? token : null,
    tenant,
    locale,
  };
  const confirmationResponse: UpdateDonationResponse = await apiRequest(
    requestParams
  );
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

const buildBillingDetails = (contactDetails: ContactDetails) => {
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
  paymentError: StripeError | string | undefined, //TODOO - identify and set better error types
  setIsPaymentProcessing: Dispatch<SetStateAction<boolean>>,
  setPaymentError: Dispatch<SetStateAction<string>>
): void => {
  setIsPaymentProcessing(false);
  if (
    (typeof paymentError !== "string" && paymentError?.message) ||
    paymentError?.data?.message
  ) {
    setPaymentError(
      (paymentError as StripeError).message ?? paymentError.data.message
    );
  } else {
    setPaymentError(paymentError as string);
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
  locale,
}: HandleStripeSCAPaymentProps): Promise<UpdateDonationData | undefined> {
  const clientSecret = paymentResponse.response.payment_intent_client_secret;
  const key =
    paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey;

  if (!window.Stripe) return;
  const stripe: Stripe = window.Stripe(key, {
    stripeAccount: paymentResponse.response.account,
  });
  switch (method) {
    case "card": {
      let successData: UpdateDonationData | undefined;
      let stripeResponse: PaymentIntentResult;
      switch (paymentResponse.response.type) {
        // cardAction requires confirmation of the payment intent to execute the payment server side
        case "cardAction":
          stripeResponse = await stripe.handleCardAction(clientSecret);
          if (stripeResponse.error) {
            setIsPaymentProcessing(false);
            setPaymentError(
              stripeResponse.error.message || "Something went wrong"
            );
            return;
          }
          try {
            const payDonationData = {
              // method not sent here as it was already captured in the 1st request.
              paymentProviderRequest: {
                account: paymentSetup.gateways.stripe.account,
                gateway: "stripe" as const,
                source: {
                  id: stripeResponse.paymentIntent.id,
                  object: "payment_intent",
                },
              },
            };
            const successResponse = await confirmPaymentIntent(
              donationID,
              payDonationData,
              token,
              setshowErrorCard,
              setPaymentError,
              tenant,
              locale
            );
            successData = successResponse;
          } catch (error) {
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
            setPaymentError(
              stripeResponse.error.message || "Something went wrong."
            );
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
      const { error } = await stripe.confirmGiropayPayment(
        paymentResponse.response.payment_intent_client_secret,
        {
          payment_method: {
            billing_details: buildBillingDetails(contactDetails),
          },
          return_url: `${window.location.origin}/${locale}?context=${donationID}&method=Giropay&tenant=${tenant}&country=${country}`,
        }
      );
      if (error) {
        handlePaymentError(error, setIsPaymentProcessing, setPaymentError);
      }
      break;
    }

    case "sepa_debit": {
      const { error } = await stripe.confirmSepaDebitPayment(clientSecret);
      if (error) {
        handlePaymentError(error, setIsPaymentProcessing, setPaymentError);
      }
      router.push({
        query: { ...router.query, step: THANK_YOU },
      });
      break;
    }
  }
}
