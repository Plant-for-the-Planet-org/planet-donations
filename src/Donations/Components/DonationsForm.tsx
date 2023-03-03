import React, { ReactElement } from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import GiftForm from "../Micros/GiftForm";
import { useTranslation } from "next-i18next";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import { getMinimumAmountForCurrency } from "../../Utils/getExchange";
import { formatAmountForStripe } from "../../Utils/stripe/stripeHelpers";
import { NativePay } from "../PaymentMethods/PaymentRequestCustomButton";
import ButtonLoader from "../../Common/ContentLoaders/ButtonLoader";
import {
  createDonationFunction,
  payDonationFunction,
} from "../PaymentMethods/PaymentFunctions";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import SelectCurrencyModal from "./../Micros/SelectCurrencyModal";
import TaxDeductionOption from "./../Micros/TaxDeductionOption";
import Authentication from "./../Micros/Authentication";
import { useAuth0 } from "@auth0/auth0-react";
import DonationAmount from "../Micros/DonationAmount";
import TreeDonation from "../Micros/DonationTypes/TreeDonation";
import FundingDonations from "../Micros/DonationTypes/FundingDonations";
import FrequencyOptions from "../Micros/FrequencyOptions";
import { useRouter } from "next/router";
import BouquetDonations from "../Micros/DonationTypes/BouquetDonations";
import { CONTACT, THANK_YOU } from "src/Utils/donationStepConstants";
import Skeleton from "@mui/material/Skeleton";
import { apiRequest } from "../../Utils/api";
import PlanetCashSelector from "../Micros/PlanetCashSelector";
import cleanObject from "src/Utils/cleanObject";
import { APIError, handleError } from "@planet-sdk/common";
import { Donation } from "src/Common/Types/donation";
import { PaymentMethod } from "@stripe/stripe-js/types/api/payment-methods";
import { PaymentRequest } from "@stripe/stripe-js/types/stripe-js/payment-request";

function DonationsForm(): ReactElement {
  const {
    isGift,
    quantity,
    currency,
    paymentSetup,
    projectDetails,
    country,
    giftDetails,
    isPaymentOptionsLoading,
    setPaymentType,
    setdonationID,
    isTaxDeductible,
    setshowErrorCard,
    queryToken,
    profile,
    frequency,
    tenant,
    isSignedUp,
    setTransferDetails,
    setRetainQuantityValue,
    isPlanetCashActive,
    onBehalf,
    onBehalfDonor,
    setdonation,
    setcountry,
    setcurrency,
    donation,
    setErrors,
    utmCampaign,
    utmMedium,
    utmSource,
  } = React.useContext(QueryParamContext);
  const { t, i18n } = useTranslation(["common", "country", "donate"]);

  const [minAmt, setMinAmt] = React.useState(0);
  const [showFrequencyOptions, setShowFrequencyOptions] = React.useState(false);
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [showDisablePlanetCashButton, setShowDisablePlanetCashButton] =
    React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMinAmt(getMinimumAmountForCurrency(currency));
  }, [currency]);

  React.useEffect(() => {
    // if the purpose is planet-cash (i.e Top-up PlanetCash) then lock the currency and country for transaction.
    // since transaction needs to happen in the same currency.

    if (projectDetails && profile) {
      if (profile?.planetCash) {
        if (projectDetails.purpose === "planet-cash") {
          setcountry(profile?.planetCash.country);
          setcurrency(profile?.planetCash.currency);
        }
      }
    }
  }, [projectDetails, profile]);

  React.useEffect(() => {
    if (paymentSetup && paymentSetup?.recurrency) {
      setShowFrequencyOptions(paymentSetup?.recurrency.supported);
    }
  }, [paymentSetup]);

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState(""); //TODOO - confirm and remove

  //Only used for native pay. Is this still applicable, or should this be removed?
  const onPaymentFunction = async (
    paymentMethod: PaymentMethod,
    paymentRequest: PaymentRequest
  ) => {
    // eslint-disable-next-line no-underscore-dangle
    setPaymentType(paymentRequest._activeBackingLibraryName); //TODOO - is _activeBackingLibraryName a private variable?

    const fullName = String(paymentMethod.billing_details.name).split(" ");
    const firstName = fullName[0];
    fullName.shift();
    const lastName = String(fullName).replace(/,/g, " ");

    //TODOO - remove type annotations by typing ContactDetails/adding better typeguards
    const contactDetails = {
      firstname: firstName,
      lastname: lastName,
      email: paymentMethod.billing_details.email as string,
      address: paymentMethod.billing_details.address?.line1 as string,
      zipCode: paymentMethod.billing_details.address?.postal_code as string,
      city: paymentMethod.billing_details.address?.city as string,
      country: paymentMethod.billing_details.address?.country as string,
    };

    let token = null;
    if (
      (!isLoading && isAuthenticated) ||
      (queryToken && profile?.address) ||
      projectDetails?.purpose === "planet-cash"
    ) {
      token = queryToken ? queryToken : await getAccessTokenSilently();
    }

    if (
      projectDetails &&
      projectDetails.purpose !== "planet-cash-signup" &&
      paymentSetup
    ) {
      await createDonationFunction({
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
        tenant,
        locale: i18n.language,
        utmCampaign,
        utmMedium,
        utmSource,
      }).then(async (res) => {
        if (res) {
          let token = null;
          if ((!isLoading && isAuthenticated) || queryToken) {
            token = queryToken ? queryToken : await getAccessTokenSilently();
          }

          payDonationFunction({
            gateway: "stripe",
            method: "card", // Hard coding card here since we only have card enabled in gpay and apple pay
            providerObject: paymentMethod, // payment method
            setIsPaymentProcessing,
            setPaymentError,
            t,
            paymentSetup,
            donationID: res.id,
            contactDetails,
            token,
            country,
            setshowErrorCard,
            router,
            tenant,
            locale: i18n.language,
            setTransferDetails,
          });
        }
      });
    }
  };

  const [openCurrencyModal, setopenCurrencyModal] = React.useState(false);

  const donationSelection = () => {
    switch (projectDetails?.purpose) {
      case "funds":
      case "planet-cash":
        return <FundingDonations setopenCurrencyModal={setopenCurrencyModal} />;
      case "conservation":
      case "bouquet":
        return <BouquetDonations setopenCurrencyModal={setopenCurrencyModal} />;
      case "trees":
      default:
        return <TreeDonation setopenCurrencyModal={setopenCurrencyModal} />;
    }
  };

  let paymentLabel = "";

  if (paymentSetup && currency && projectDetails) {
    switch (projectDetails.purpose) {
      case "trees":
        paymentLabel = t("treesInCountry", {
          treeCount: quantity,
        });
        break;
      case "funds":
        paymentLabel = t("fundingPaymentLabel", {
          amount: getFormatedCurrency(
            i18n.language,
            currency,
            paymentSetup.unitCost * quantity
          ),
        });
        break;
      case "bouquet":
      case "conservation":
        paymentLabel = t("bouquetPaymentLabel", {
          amount: getFormatedCurrency(
            i18n.language,
            currency,
            paymentSetup.unitCost * quantity
          ),
        });
        break;
      default:
        paymentLabel = t("treesInCountry", {
          treeCount: quantity,
        });
        break;
    }
  }

  const handlePlanetCashDonate = async () => {
    if (projectDetails && projectDetails.purpose !== "planet-cash-signup") {
      setShowDisablePlanetCashButton(true);
      const _onBehalfDonor = {
        firstname: onBehalfDonor.firstName,
        lastname: onBehalfDonor.lastName,
        email: onBehalfDonor.email,
      };

      const _metadata = {
        utm_campaign: utmCampaign,
        utm_medium: utmMedium,
        utm_source: utmSource,
      };

      const _gift = {
        ...giftDetails,
      };

      if (giftDetails.type === "direct") {
        delete _gift.message;
        delete _gift.recipientName;
      }

      // create Donation data
      const donationData = {
        purpose: projectDetails.purpose,
        project: projectDetails.id,
        units: quantity,
        prePaid: true,
        onBehalf: onBehalf,
        metadata: _metadata,
        ...(onBehalf && { donor: _onBehalfDonor }),
        ...(isGift && { gift: _gift }),
      };

      const cleanedDonationData = cleanObject(donationData);

      const token = queryToken ? queryToken : await getAccessTokenSilently();

      // @method    POST
      // @endpoint  /app/donation

      try {
        const { data, status } = await apiRequest({
          url: "/app/donations",
          method: "POST",
          setshowErrorCard,
          data: cleanedDonationData,
          token,
          addIdempotencyKeyHeader: true,
          tenant,
          locale: i18n.language,
        });

        if (status === 200) {
          setdonation(data as Donation); //TODOO - remove annotation by specifying type returned by apiRequest
          router.replace({
            query: { ...router.query, step: THANK_YOU },
          });
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
        setShowDisablePlanetCashButton(false);
      }
    }
  };

  return isPaymentProcessing ? (
    <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
  ) : projectDetails ? (
    <div className="donations-forms-container">
      <div className="w-100">
        <Authentication />
        <div className="donations-tree-selection-step">
          {projectDetails.purpose !== "funds" && (
            <p className="title-text">{t("donate")}</p>
          )}
          {/* show PlanetCashSelector only if user is signed up and have a planetCash account */}
          {projectDetails.purpose !== "funds" &&
            projectDetails.purpose !== "planet-cash" &&
            !(isGift && giftDetails.recipientName === "") &&
            !(onBehalf && onBehalfDonor.firstName === "") &&
            isSignedUp &&
            profile?.planetCash && <PlanetCashSelector />}
          {!(onBehalf && onBehalfDonor.firstName === "") &&
            (projectDetails.purpose === "trees" ? (
              <div className="donations-gift-container mt-10">
                <GiftForm />
              </div>
            ) : (
              <></>
            ))}
          {process.env.RECURRENCY &&
            showFrequencyOptions &&
            paymentSetup &&
            (!(onBehalf && onBehalfDonor.firstName === "") &&
            !(isGift && giftDetails.recipientName === "") ? (
              <div
                className={`donations-gift-container mt-10 ${
                  Object.keys(paymentSetup.frequencies).length == 2
                    ? "funds-frequency-container"
                    : ""
                }`}
              >
                <FrequencyOptions />
              </div>
            ) : isGift || onBehalf ? (
              <></>
            ) : (
              // TODO - remove if we never reach this code.
              <div className={`donations-gift-container mt-10 `}>
                <Skeleton variant="rectangular" width={"100%"} height={40} />
              </div>
            ))}
          {!(onBehalf && onBehalfDonor.firstName === "") && donationSelection()}
          {/* {!(isGift && giftDetails.recipientName === "") &&
            isPlanetCashActive && <OnBehalf />} */}
          {!isPlanetCashActive &&
            !(isGift && giftDetails.recipientName === "") && (
              <TaxDeductionOption />
            )}
          <div
            className={`${
              (isGift && giftDetails.recipientName === "") ||
              (onBehalf && onBehalfDonor.firstName === "")
                ? "display-none"
                : ""
            }`}
          >
            <div className={"horizontal-line"} />

            {(projectDetails.purpose === "trees" ||
              projectDetails.purpose === "conservation") && <DonationAmount />}

            {/* Hide NativePay if PlanetCash is active */}

            {!isPlanetCashActive ? (
              paymentSetup && paymentSetup?.unitCost && projectDetails ? (
                minAmt && paymentSetup?.unitCost * quantity >= minAmt ? (
                  !isPaymentOptionsLoading &&
                  paymentSetup?.gateways?.stripe?.account &&
                  currency ? (
                    <NativePay
                      country={country}
                      currency={currency}
                      amount={formatAmountForStripe(
                        paymentSetup?.unitCost * quantity,
                        currency.toLowerCase()
                      )}
                      onPaymentFunction={onPaymentFunction}
                      paymentSetup={paymentSetup}
                      continueNext={() => {
                        router.push(
                          {
                            query: { ...router.query, step: CONTACT },
                          },
                          undefined,
                          { shallow: true }
                        );
                        setRetainQuantityValue(true);
                      }}
                      isPaymentPage={false}
                      paymentLabel={paymentLabel}
                      frequency={frequency}
                    />
                  ) : (
                    <div className="mt-20 w-100">
                      <ButtonLoader />
                    </div>
                  )
                ) : minAmt > 0 ? (
                  <p className={"text-danger mt-20 text-center"}>
                    {t("minDonate")}{" "}
                    <span>
                      {getFormatedCurrency(i18n.language, currency, minAmt)}
                    </span>
                  </p>
                ) : (
                  <div className="mt-20 w-100">
                    <ButtonLoader />
                  </div>
                )
              ) : (
                <div className="mt-20 w-100">
                  <ButtonLoader />
                </div>
              )
            ) : !showDisablePlanetCashButton ? (
              <button
                onClick={handlePlanetCashDonate}
                className="primary-button w-100 mt-30"
              >
                {t("donateWithPlanetCash")}
              </button>
            ) : (
              <>
                <button className="secondary-button w-100 mt-30">
                  {t("donateWithPlanetCash")}
                </button>
                {!donation && <PaymentProgress isPaymentProcessing={true} />}
              </>
            )}
          </div>
        </div>
      </div>

      <SelectCurrencyModal
        openModal={openCurrencyModal}
        handleModalClose={() => setopenCurrencyModal(false)}
      />
    </div>
  ) : (
    <></>
  );
}

export default DonationsForm;
