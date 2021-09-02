import { apiRequest } from "../../Utils/api";
import { CreateDonationFunctionProps } from "../../Common/Types";
import { useRouter } from "next/router";

export function getPaymentProviderRequest(
  gateway,
  paymentSetup,
  paymentMethod
) {
  let payDonationData;
  if (gateway === "stripe") {
    payDonationData = {
      paymentProviderRequest: {
        account: paymentSetup.gateways.stripe.account,
        gateway: "stripe_pi",
        source: {
          id: paymentMethod.id,
          object: "payment_method",
        },
      },
    };
  } else if (gateway === "paypal") {
    payDonationData = {
      paymentProviderRequest: {
        account: paymentSetup.gateways.paypal.account,
        gateway: "paypal",
        source: {
          ...paymentMethod,
        },
      },
    };
  } else if (gateway === "stripe_giropay") {
    payDonationData = {
      paymentProviderRequest: {
        account: paymentSetup.gateways.stripe.account,
        gateway: "stripe_pi",
        source: {
          object: "giropay",
        },
      },
    };
  } else if (gateway === "stripe_sofort") {
    payDonationData = {
      paymentProviderRequest: {
        account: paymentSetup.gateways.stripe.account,
        gateway: "stripe_pi",
        source: {
          object: "sofort",
        },
      },
    };
  }
  return payDonationData;
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
  frequency
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
    frequency
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
  frequency
}: any) {
  let donationData = {
    purpose: projectDetails.purpose,
    project: projectDetails.id,
    quantity:quantity,
    amount: Math.round((unitCost * quantity + Number.EPSILON) * 100) / 100,
    currency,
    donor: { ...contactDetails },
    frequency:frequency === 'once' ? null : frequency
  };
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
  paymentMethod,
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
}: any) {
  // const router = useRouter();
  setIsPaymentProcessing(true);

  if (!paymentMethod) {
    setIsPaymentProcessing(false);
    setPaymentError(t("donate:noPaymentMethodError"));
    return;
  }

  const payDonationData = getPaymentProviderRequest(
    gateway,
    paymentSetup,
    paymentMethod
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
      if (paidDonation.data.status === "failed") {
        setIsPaymentProcessing(false);
        setPaymentError(paidDonation.data.message);
      } else if (
        paidDonation.data.paymentStatus === "success" ||
        paidDonation.data.paymentStatus === "pending" ||
        paidDonation.data.status === "success" ||
        paidDonation.data.status === "paid" ||
        paidDonation.data.paymentStatus === "paid"
      ) {
        setIsPaymentProcessing(false);
        router.replace({
          query: { ...router.query, step: "thankyou" },
        });
        // setdonationStep(4);

        return paidDonation.data;
      } else if (paidDonation.data.status === "action_required") {
        handleSCAPaymentFunction({
          gateway,
          paidDonation: paidDonation.data,
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

export async function handleSCAPaymentFunction({
  gateway,
  paidDonation,
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
}: any) {
  const clientSecret = paidDonation.response.payment_intent_client_secret;
  const key = paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey
    : paymentSetup?.gateways?.stripe?.stripePublishableKey;
  const stripe = window.Stripe(key, {
    stripeAccount: paidDonation.response.account,
  });
  // const router = useRouter();
  if (stripe) {
    if (gateway === "stripe") {
      const SCAdonation = await stripe.handleCardAction(clientSecret);
      if (SCAdonation) {
        if (SCAdonation.error) {
          setIsPaymentProcessing(false);
          setPaymentError(SCAdonation.error.message);
        } else {
          const payDonationData = {
            paymentProviderRequest: {
              account: paymentSetup.gateways.stripe.account,
              gateway: "stripe_pi",
              source: {
                id: SCAdonation.paymentIntent.id,
                object: "payment_intent",
              },
            },
          };

          try {
            let SCAPaidDonation;
            if (token) {
              const requestParams = {
                url: `/app/donations/${donationID}`,
                data: payDonationData,
                method: "PUT",
                setshowErrorCard,
                token: token,
              };
              SCAPaidDonation = await apiRequest(requestParams);
            } else {
              const requestParams = {
                url: `/app/donations/${donationID}`,
                data: payDonationData,
                method: "PUT",
                setshowErrorCard,
              };
              SCAPaidDonation = await apiRequest(requestParams);
            }

            if (
              SCAPaidDonation.data.paymentStatus ||
              SCAPaidDonation.data.status
            ) {
              setIsPaymentProcessing(false);
              // setdonationStep(4);
              router.push({
                query: { ...router.query, step: "thankyou" },
              });
              return SCAPaidDonation.data;
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
              setIsPaymentProcessing(false);
              setPaymentError(
                error.data.error ? error.data.error.message : error.data.message
              );
            }
            setIsPaymentProcessing(false);
          }
        }
      }
    } else if (gateway === "stripe_giropay") {
      const { error, paymentIntent } = await stripe.confirmGiropayPayment(
        paidDonation.response.payment_intent_client_secret,
        {
          payment_method: {
            billing_details: {
              name: `${contactDetails.firstname} ${contactDetails.lastname}`,
              email: contactDetails.email,
              address: {
                city: contactDetails.city,
                country: contactDetails.country,
                line1: contactDetails.address,
                postal_code: contactDetails.zipCode,
              },
            },
          },
          return_url: `${window.location.origin}/?context=${donationID}&method=Giropay`,
        }
      );

      if (error) {
        setIsPaymentProcessing(false);
        if (error.message) {
          setPaymentError(error.message);
        } else {
          setPaymentError(error);
        }
      } else {
        return;
      }
    } else if (gateway === "stripe_sofort") {
      const { error, paymentIntent } = await stripe.confirmSofortPayment(
        paidDonation.response.payment_intent_client_secret,
        {
          payment_method: {
            sofort: {
              country: country,
            },
            billing_details: {
              name: `${contactDetails.firstname} ${contactDetails.lastname}`,
              email: contactDetails.email,
              address: {
                city: contactDetails.city,
                country: contactDetails.country,
                line1: contactDetails.address,
                postal_code: contactDetails.zipCode,
              },
            },
          },
          return_url: `${window.location.origin}/?context=${donationID}&method=Sofort`,
        }
      );

      if (error) {
        setIsPaymentProcessing(false);
        if (error.message) {
          setPaymentError(error.message);
        } else {
          setPaymentError(error);
        }
      } else {
        console.log("paymentIntent", paymentIntent);
      }
    }
  }
}
