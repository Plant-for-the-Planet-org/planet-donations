import React from "react";
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
import { Skeleton } from "@material-ui/lab";
import { apiRequest } from "../../Utils/api";
import PlanetCashSelector from "../Micros/PlanetCashSelector";
import OnBehalf from "../Micros/OnBehalf";
import cleanObject from "src/Utils/cleanObject";

function DonationsForm() {
  const {
    isGift,
    setdonationStep,
    quantity,
    currency,
    paymentSetup,
    projectDetails,
    country,
    giftDetails,
    setIsTaxDeductible,
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
  } = React.useContext(QueryParamContext);
  const { t, i18n } = useTranslation(["common", "country", "donate"]);

  const [minAmt, setMinAmt] = React.useState(0);
  const [showFrequencyOptions, setShowFrequencyOptions] = React.useState(false);
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0();
  const [showDisablePlanetCashButton, setShowDisablePlanetCashButton] =
    React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    // Allow User to Top-up PlanetCash only if they are authenticated

    if (projectDetails) {
      if (projectDetails.purpose === "planet-cash") {
        if (!isLoading && !isAuthenticated) {
          loginWithRedirect({
            redirectUri: window?.location.origin + router.asPath,
            ui_locales: localStorage.getItem("language") || "en",
          });
        }
      }
    }
  }, [projectDetails, isAuthenticated, isLoading]);

  React.useEffect(() => {
    // Restrict user from adding top-up to other's account

    if (projectDetails && profile) {
      if (profile!.planetCash) {
        if (projectDetails.purpose === "planet-cash") {
          if (projectDetails.id !== profile!.planetCash.account) {
            router.push("/");
          }
        }
      } else if (
        !profile.planetCash &&
        projectDetails.purpose === "planet-cash"
      ) {
        router.push("/");
      }
    }
  }, [projectDetails, profile, router]);

  React.useEffect(() => {
    setMinAmt(getMinimumAmountForCurrency(currency));
  }, [currency]);

  React.useEffect(() => {
    // if the purpose is planet-cash (i.e Top-up PlanetCash) then lock the currency and country for transaction.
    // since transaction needs to happen in the same currency.

    if (projectDetails && profile) {
      if (profile!.planetCash) {
        if (projectDetails.purpose === "planet-cash") {
          setcountry(profile!.planetCash.country);
          setcurrency(profile!.planetCash.currency);
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
  const purposes = ["trees"];
  const [paymentError, setPaymentError] = React.useState("");
  const onPaymentFunction = async (paymentMethod: any, paymentRequest: any) => {
    // eslint-disable-next-line no-underscore-dangle
    setPaymentType(paymentRequest._activeBackingLibraryName);

    let fullName = paymentMethod.billing_details.name;
    fullName = String(fullName).split(" ");
    const firstName = fullName[0];
    fullName.shift();
    const lastName = String(fullName).replace(/,/g, " ");

    const contactDetails = {
      firstname: firstName,
      lastname: lastName,
      email: paymentMethod.billing_details.email,
      address: paymentMethod.billing_details.address.line1,
      zipCode: paymentMethod.billing_details.address.postal_code,
      city: paymentMethod.billing_details.address.city,
      country: paymentMethod.billing_details.address.country,
    };

    let token = null;
    if ((!isLoading && isAuthenticated) || (queryToken && profile.address)) {
      token = queryToken ? queryToken : await getAccessTokenSilently();
    }

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
          setTransferDetails,
        });
      }
    });
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
    switch (projectDetails?.purpose) {
      case "trees":
        paymentLabel = t("treesInCountry", {
          treeCount: quantity,
          // country: t(`country:${projectDetails.country.toLowerCase()}`),
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
          country: t(`country:${projectDetails?.country?.toLowerCase()}`),
        });
        break;
    }
  }

  const handlePlanetCashDonate = async () => {
    setShowDisablePlanetCashButton(true);
    const _onBehalfDonor = {
      firstname: onBehalfDonor.firstName,
      lastname: onBehalfDonor.lastName,
      email: onBehalfDonor.email,
    };

    const _gift = {
      ...giftDetails,
      message: giftDetails.giftMessage,
    };

    delete _gift.giftMessage;

    // create Donation data
    const donationData = {
      purpose: projectDetails!.purpose,
      project: projectDetails!.id,
      units: quantity,
      prePaid: true,
      onBehalf: onBehalf,
      ...(onBehalf && { donor: _onBehalfDonor }),
      ...(isGift && { gift: _gift }),
    };

    const cleanedDonationData = cleanObject(donationData);

    const token = await getAccessTokenSilently();

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
      });

      if (status === 200) {
        setdonation(data);
        router.replace({
          query: { ...router.query, step: THANK_YOU },
        });
      }
    } catch (err) {
      console.error(err);
      if (err.status === 400) {
        setPaymentError(err.data.message);
      } else if (err.status === 500) {
        setPaymentError(t("genericErrorMessage"));
      } else if (err.status === 503) {
        setPaymentError(t("errorStatus503"));
      } else {
        setPaymentError(err.message);
      }
      setShowDisablePlanetCashButton(false);
    }
  };

  return isPaymentProcessing ? (
    <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
  ) : projectDetails ? (
    <div className="donations-forms-container">
      <div className="w-100">
        <Authentication />
        <div className="donations-tree-selection-step">
          {projectDetails?.purpose !== "funds" && (
            <p className="title-text">{t("donate")}</p>
          )}

          {/* show PlanetCashSelector only if user is signed up and have a planetCash account */}
          {projectDetails.purpose !== "funds" &&
            projectDetails.purpose !== "planet-cash" &&
            !(isGift && giftDetails.recipientName === "") &&
            !(onBehalf && onBehalfDonor.firstName === "") &&
            isSignedUp &&
            profile!.planetCash && <PlanetCashSelector />}

          {!(onBehalf && onBehalfDonor.firstName === "") &&
            (projectDetails?.purpose === "trees" ? (
              <div className="donations-gift-container mt-10">
                <GiftForm />
              </div>
            ) : (
              <></>
            ))}

          {process.env.RECURRENCY &&
            showFrequencyOptions &&
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
              <div className={`donations-gift-container mt-10 `}>
                <Skeleton variant="rect" width={"100%"} height={40} />
              </div>
            ))}

          {!(onBehalf && onBehalfDonor.firstName === "") && donationSelection()}

          {!(isGift && giftDetails.recipientName === "") &&
            isPlanetCashActive && <OnBehalf />}

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
                {!donation && <PaymentProgress />}
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
