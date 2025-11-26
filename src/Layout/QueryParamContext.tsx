import { useRouter } from "next/dist/client/router";
import React, {
  useState,
  ReactElement,
  ReactNode,
  createContext,
  useEffect,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { apiRequest } from "../Utils/api";
import { useTranslation } from "next-i18next";
import { getRandomProjects } from "../Utils/projects/filterProjects";
import { ThemeContext } from "../../styles/themeContext";
import countriesData from "../Utils/countriesData.json";
import { setCountryCode } from "src/Utils/setCountryCode";
import { THANK_YOU } from "src/Utils/donationStepConstants";
import {
  CurrencyList,
  PaymentOptions,
  FetchedProjectDetails,
  PlanetCashSignupDetails,
  OnBehalfDonor,
  ConfigResponse,
  GiftDetails,
} from "src/Common/Types";
import { useAuth0 } from "@auth0/auth0-react";
import { validateToken } from "../Utils/tokenActions";
import QueryParamContextInterface from "src/Common/Types/QueryParamContextInterface";
import { ProjectMapInfo as Project } from "@planet-sdk/common/build/types/project/map";
import { User } from "@planet-sdk/common/build/types/user";
import {
  Donation,
  NoGift,
  ContactDetails,
  BankTransferDetails,
} from "@planet-sdk/common/build/types/donation";
import ErrorPopup from "src/Common/ErrorPopup/ErrorPopup";
import { APIError, handleError, SerializedError } from "@planet-sdk/common";
import { PaymentRequest } from "@stripe/stripe-js/types/stripe-js/payment-request";
import { createProjectDetails } from "src/Utils/createProjectDetails";
import { useDebouncedEffect } from "src/Utils/useDebouncedEffect";
import { supportedDonationConfig } from "src/Utils/supportedDonationConfig";
import { DEFAULT_TENANT } from "src/Utils/defaultTenant";
import { Stripe as StripeJS } from "@stripe/stripe-js";
import getStripe from "src/Utils/stripe/getStripe";
import { isBlacklistedEmail } from "src/Utils/isBlacklistedEmail";

export const QueryParamContext =
  createContext<QueryParamContextInterface>(null);

const QueryParamProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const router = useRouter();

  const { i18n } = useTranslation();
  const {
    getAccessTokenSilently,
    isLoading,
    isAuthenticated,
    loginWithRedirect,
  } = useAuth0();

  const [paymentSetup, setpaymentSetup] = useState<PaymentOptions | null>(null);
  const [stripePromise, setStripePromise] =
    useState<Promise<StripeJS | null> | null>(null);

  const [projectDetails, setprojectDetails] =
    useState<FetchedProjectDetails | null>(null);
  const [pCashSignupDetails, setPCashSignupDetails] =
    useState<PlanetCashSignupDetails | null>(null);

  // Query token is the access token which is passed in the query params
  const [queryToken, setqueryToken] = useState<string | null>(null);

  const [donationStep, setdonationStep] = useState<null | number>(null);
  // TODO - remove language if not needed
  const [language, setlanguage] = useState(i18n.language);

  const [donationID, setdonationID] = useState<string | null>(null);
  const [tenant, setTenant] = useState<string | null>(null);

  // for tax deduction part
  const [isTaxDeductible, setIsTaxDeductible] = useState(false);
  const [allowTaxDeductionChange, setallowTaxDeductionChange] = useState(true);

  const [isDirectDonation, setisDirectDonation] = useState(false);

  const [donationUid, setDonationUid] = useState<string>("");

  const [isPaymentOptionsLoading, setIsPaymentOptionsLoading] = useState(false);

  const [paymentType, setPaymentType] = useState("");

  const [quantity, setquantity] = useState(50);
  const [frequency, setfrequency] = useState<string>("once");

  const [isGift, setIsGift] = useState<boolean>(false);
  const [giftDetails, setGiftDetails] = useState<GiftDetails | NoGift>({
    recipientName: "",
    recipientEmail: "",
    message: "",
    type: null,
  });

  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    firstname: "",
    lastname: "",
    tin: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    companyname: "",
  });

  const [country, setcountry] = useState("");
  const [currency, setcurrency] = useState("");
  const [enabledCurrencies, setEnabledCurrencies] =
    useState<CurrencyList | null>(null);
  const [callbackUrl, setcallbackUrl] = useState("");
  const [taxIdentificationAvail, setTaxIdentificationAvail] = useState(false);
  const [callbackMethod, setCallbackMethod] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [isPackageWanted, setIsPackageWanted] = useState<boolean | null>(null);

  const [redirectstatus, setredirectstatus] = useState<string | null>(null);

  const [shouldCreateDonation, setshouldCreateDonation] = useState(false);

  const [selectedProjects, setSelectedProjects] = useState<Array<Project>>([]);
  const [allProjects, setAllProjects] = useState<Array<Project>>([]);

  const [hideTaxDeduction, sethideTaxDeduction] = useState(false);

  const [profile, setprofile] = useState<User | null>(null);
  const [amount, setAmount] = useState<null | number>(null);
  const [retainQuantityValue, setRetainQuantityValue] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const [hideLogin, setHideLogin] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [transferDetails, setTransferDetails] =
    useState<BankTransferDetails | null>(null);

  const [isPlanetCashActive, setIsPlanetCashActive] = useState<boolean | null>(
    null
  );

  // Only used when planetCash is active
  const [onBehalf, setOnBehalf] = useState(false);

  const [onBehalfDonor, setOnBehalfDonor] = useState<OnBehalfDonor>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [donation, setDonation] = useState<Donation | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );

  const [isSupportedDonation, setIsSupportedDonation] = useState(false);
  const [supportedProjectId, setSupportedProjectId] = useState<string | null>(
    null
  );

  const [errors, setErrors] = React.useState<SerializedError[] | null>(null);
  const [showErrorCard, setShowErrorCard] = useState(false);

  const loadEnabledCurrencies = async () => {
    try {
      const requestParams = {
        url: `/app/currencies`,
        setShowErrorCard,
        shouldQueryParamAdd: false,
      };
      const response: { data: Record<string, string> } = await apiRequest(
        requestParams
      );
      setEnabledCurrencies(response.data);
    } catch (err) {
      console.log(err);
      setEnabledCurrencies(null);
    }
  };

  useEffect(() => {
    // Enabled currencies are only needed on step 1, if not already populated
    if (!enabledCurrencies && donationStep !== null && donationStep <= 1)
      loadEnabledCurrencies();
  }, [donationStep, enabledCurrencies]);

  useEffect(() => {
    if (
      currency &&
      enabledCurrencies &&
      enabledCurrencies[currency] === undefined
    ) {
      setCountryCode({ setcountry, setcurrency, country: "DE" });
    }
  }, [currency, enabledCurrencies]);

  useEffect(() => {
    if (paymentError) {
      router.replace({
        query: { ...router.query, step: THANK_YOU },
      });
    }
  }, [paymentError]);

  function testURL(url: string) {
    const pattern = new RegExp(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
    );
    // regex source https://tutorial.eyehunts.com/js/url-regex-validation-javascript-example-code/
    return !!pattern.test(url);
  }
  useEffect(() => {
    if (
      router.query.callback_url &&
      typeof router.query.callback_url === "string"
    ) {
      if (testURL(router.query.callback_url)) {
        setcallbackUrl(router.query.callback_url);
      }
    }
  }, [router.query.callback_url]);

  useEffect(() => {
    if (router.query.callback_method) {
      setCallbackMethod(router.query.callback_method as string);
    }
  }, [router.query.callback_method]);

  useEffect(() => {
    if (
      paymentSetup?.frequencies &&
      Object.keys(paymentSetup.frequencies).length === 2
    ) {
      setfrequency(Object.keys(paymentSetup?.frequencies)[0]);
    }
    setRetainQuantityValue(false);
  }, [paymentSetup]);

  useEffect(() => {
    const stripeKey =
      paymentSetup?.gateways?.stripe?.authorization?.stripePublishableKey;
    if (stripeKey) {
      const stripePromise = getStripe(stripeKey, i18n.language);

      // Handle the error at the promise level
      stripePromise.catch((e) => {
        console.error("Failed to initialize Stripe", e);
        setStripePromise(Promise.resolve(null));
      });

      setStripePromise(stripePromise);
    }
  }, [
    paymentSetup?.gateways?.stripe?.authorization?.stripePublishableKey,
    i18n.language,
  ]);

  const loadSelectedProjects = useCallback(async () => {
    try {
      const requestParams = {
        url: `/app/projects?_scope=map&filter[purpose]=trees,restoration,conservation`,
        setShowErrorCard,
        tenant: tenant || DEFAULT_TENANT,
        locale: i18n.language,
      };
      const response = await apiRequest(requestParams);
      const projects = response.data as Project[];
      if (projects) {
        const allowedDonationsProjects = projects.filter(
          (project) => project.properties.allowDonations === true
        );
        setAllProjects(allowedDonationsProjects);
        if (allowedDonationsProjects?.length < 6) {
          setSelectedProjects(allowedDonationsProjects);
        } else {
          const randomProjects = getRandomProjects(allowedDonationsProjects, 6);
          setSelectedProjects(randomProjects);
        }
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  }, [tenant, i18n.language]);

  const loadProfile = useCallback(async () => {
    const token =
      queryToken ||
      (router.query.token as string) ||
      (await getAccessTokenSilently());
    try {
      const profile = await apiRequest({
        url: "/app/profile",
        token: token,
        setShowErrorCard,
        tenant: tenant || DEFAULT_TENANT,
        locale: i18n.language,
      });
      setprofile(profile.data);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  }, []);

  const showPlanetCashSignUpScreen = () => {
    setprojectDetails(null);
    setPCashSignupDetails({
      name: `PlanetCash - ${profile?.displayName}`,
      ownerName: profile?.displayName || "",
      ownerAvatar: profile?.image || "",
      purpose: "planet-cash-signup",
    });
    setdonationStep(null);
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      loadProfile();
    }
  }, [isLoading, isAuthenticated, loadProfile]);

  useEffect(() => {
    const regex = /^pcash_/;
    if (router.query.to && regex.test(router.query.to as string)) {
      router.push("/");
    } else if (router.query.to?.toString().toLowerCase() === "planetcash") {
      if (
        !queryToken &&
        !router.query.token &&
        !isLoading &&
        !isAuthenticated
      ) {
        loginWithRedirect({
          redirectUri: window?.location.href,
        });
      } else {
        if (profile && profile?.planetCash?.account) {
          loadPaymentSetup({
            projectGUID: profile?.planetCash?.account,
            paymentSetupCountry: country,
            shouldSetPaymentDetails: true,
          });
          setdonationStep(1);
        } else if (!profile?.planetCash) {
          if (router.query.token) {
            if (validateToken(router.query.token as string)) {
              if (!profile) {
                loadProfile();
              } else if (!profile?.planetCash && profile?.displayName) {
                showPlanetCashSignUpScreen();
              }
            } else {
              // If token is invalid force user to login
              router.push("/?to=planetcash&step=donate");
            }
          } else if (profile?.displayName) {
            showPlanetCashSignUpScreen();
          }
        }
      }
    }
  }, [
    router.query.to,
    country,
    profile,
    isLoading,
    isAuthenticated,
    router.query.token,
  ]);

  useDebouncedEffect(
    () => {
      const regex = /^pcash_/;
      if (
        router.query.to &&
        !regex.test(router.query.to as string) &&
        country !== undefined &&
        country !== "" &&
        router.query.to?.toString().toLowerCase() !== "planetcash"
      ) {
        const to = String(router.query.to).replace(/\//g, "");
        loadPaymentSetup({
          projectGUID: to,
          paymentSetupCountry: country,
          shouldSetPaymentDetails: true,
        });
      }
    },
    1000,
    [router.query.to, country, profile?.slug]
  );

  async function loadConfig() {
    try {
      const requestParams = {
        url: process.env.CONFIG_URL || `/app/config`,
        setShowErrorCard,
        shouldQueryParamAdd: false,
      };
      const config: { data: ConfigResponse } = await apiRequest(requestParams);
      if (config.data) {
        if (!router.query.country) {
          const found = countriesData.some(
            (arrayCountry) =>
              arrayCountry.countryCode?.toUpperCase() ===
              config.data.country?.toUpperCase()
          );
          if (found) {
            // This is to make sure donations which are already created with some country do not get affected by country from user config
            if (!router.query.context) {
              setCountryCode({
                setcountry,
                setcurrency,
                configCountry: config.data.country?.toUpperCase(),
              });
            }
          }
        }
        if (!router.query.context) {
          setContactDetails((contactDetails) => {
            return {
              ...contactDetails,
              city:
                config.data.loc && config.data.loc.city
                  ? config.data.loc.city
                  : "",
              zipCode:
                config.data.loc && config.data.loc.postalCode
                  ? config.data.loc.postalCode
                  : "",
              country: config.data.loc?.countryCode
                ? config.data.loc.countryCode
                : "",
            };
          });
        }
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  }

  useEffect(() => {
    if (router.isReady) {
      loadConfig();
    }
  }, [router.isReady]);

  // Tree Count = treecount => Received from the URL
  useEffect(() => {
    if (router.query.units) {
      // Do not allow 0 or negative numbers and string
      if (Number(router.query.units) > 0 && paymentSetup?.unitCost) {
        setquantity(Number(router.query.units));
      }
    }
    setRetainQuantityValue(false);
  }, [router.query.units, paymentSetup]);

  useEffect(() => {
    if (router.query.method) {
      // TODO => only allow the ones which we use, add an array and check if it exists in that array
      setPaymentType(router.query.method as string);
    }
  }, [router.query.method]);

  useEffect(() => {
    if (router.query.redirect_status) {
      setredirectstatus(router.query.redirect_status as string);
    }
  }, [router.query.redirect_status]);

  useEffect(() => {
    setshouldCreateDonation(true);
  }, [
    paymentSetup,
    quantity,
    isGift,
    giftDetails,
    contactDetails.firstname,
    contactDetails.lastname,
    contactDetails.tin,
    contactDetails.email,
    contactDetails.address,
    contactDetails.city,
    contactDetails.zipCode,
    contactDetails.country,
    contactDetails.companyname,
    isPackageWanted,
    isTaxDeductible,
  ]);

  useEffect(() => {
    if (router.query.error) {
      if (
        router.query.error_description === "401" &&
        router.query.error === "unauthorized"
      ) {
        router.replace({
          query: { to: router.query.to, step: router.query.step },
        });
        setHideLogin(true);
      }
    }
  }, []);

  const loadPaymentSetup = async ({
    projectGUID,
    paymentSetupCountry,
    shouldSetPaymentDetails,
  }: {
    projectGUID: string;
    paymentSetupCountry: string;
    shouldSetPaymentDetails?: boolean;
  }) => {
    const token =
      profile === null
        ? null
        : queryToken ||
          (router.query.token as string) ||
          (await getAccessTokenSilently());

    setIsPaymentOptionsLoading(true);
    try {
      const requestParams = {
        url: `/app/paymentOptions/${projectGUID}?country=${paymentSetupCountry}`,
        setShowErrorCard,
        token,
        tenant: tenant || DEFAULT_TENANT,
        locale: i18n.language,
      };
      const paymentSetupData: { data: PaymentOptions } = await apiRequest(
        requestParams
      );
      if (paymentSetupData.data) {
        const paymentSetup = paymentSetupData.data;
        if (shouldSetPaymentDetails) {
          setcurrency(paymentSetup.currency);
          if (!country) {
            setcountry(paymentSetup.effectiveCountry);
            localStorage.setItem("countryCode", paymentSetup.effectiveCountry);
          }

          setpaymentSetup(paymentSetup);
        }
        setprojectDetails(createProjectDetails(paymentSetup));
      }
      setIsPaymentOptionsLoading(false);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  const updateContactDetails = (details: ContactDetails) => {
    const cleanDetails = { ...details };
    // Check if isPackageWanted somehow exists on the object
    if ("isPackageWanted" in cleanDetails) {
      delete cleanDetails.isPackageWanted;
    }
    // Update the state with the sanitized object
    setContactDetails(cleanDetails);
  };

  const getDonationBreakdown = useCallback(() => {
    if (!paymentSetup || !isSupportedDonation || !tenant) {
      const totalAmount = paymentSetup ? paymentSetup.unitCost * quantity : 0;
      return {
        mainProjectAmount: totalAmount,
        supportAmount: 0,
        totalAmount,
        mainProjectQuantity: quantity,
        supportProjectQuantity: 0,
      };
    }

    const config = supportedDonationConfig[tenant];
    const mainProjectAmount = paymentSetup.unitCost * quantity;
    const supportAmount =
      (mainProjectAmount * config.supportPercentage) /
      (1 - config.supportPercentage);
    const totalAmount = mainProjectAmount + supportAmount;

    return {
      mainProjectAmount,
      supportAmount,
      totalAmount,
      mainProjectQuantity: quantity,
      supportProjectQuantity: supportAmount,
    };
  }, [paymentSetup, quantity, isSupportedDonation, tenant]);

  useEffect(() => {
    if (
      tenant &&
      projectDetails &&
      supportedDonationConfig[tenant] &&
      (projectDetails.purpose === "trees" ||
        projectDetails.purpose === "conservation")
    ) {
      const config = supportedDonationConfig[tenant];
      setIsSupportedDonation(true);
      setSupportedProjectId(config.supportedProject);
      setcountry(config.country);
      localStorage.setItem("countryCode", config.country);
      setEnabledCurrencies((prev) => {
        if (prev && prev[config.currency]) {
          return { [config.currency]: prev[config.currency] };
        } else {
          return null;
        }
      });
    } else {
      setIsSupportedDonation(false);
      setSupportedProjectId(null);
    }
  }, [tenant, projectDetails]);

  // Reset the message field if the user's email belongs to a blacklisted domain
  useEffect(() => {
    const userEmail = profile?.email || contactDetails.email;

    if (!userEmail) return;

    if (isBlacklistedEmail(userEmail)) {
      setGiftDetails(
        (prev) =>
          ({
            ...prev,
            message: "",
          } as GiftDetails)
      );
    }
  }, [profile?.email, contactDetails.email]);

  return (
    <QueryParamContext.Provider
      value={{
        isGift,
        setIsGift,
        giftDetails,
        setGiftDetails,
        contactDetails,
        updateContactDetails,
        country,
        setcountry,
        paymentSetup,
        setpaymentSetup,
        stripePromise,
        setStripePromise,
        currency,
        setcurrency,
        enabledCurrencies,
        setEnabledCurrencies,
        donationStep,
        setdonationStep,
        projectDetails,
        setprojectDetails,
        pCashSignupDetails,
        setPCashSignupDetails,
        quantity,
        setquantity,
        language,
        setlanguage,
        donationID,
        setdonationID,
        paymentType,
        setPaymentType,
        setshouldCreateDonation,
        shouldCreateDonation,
        isTaxDeductible,
        setIsTaxDeductible,
        isPaymentOptionsLoading,
        setIsPaymentOptionsLoading,
        redirectstatus,
        setredirectstatus,
        callbackUrl,
        setcallbackUrl,
        callbackMethod,
        setCallbackMethod,
        utmCampaign,
        setUtmCampaign,
        utmMedium,
        setUtmMedium,
        utmSource,
        setUtmSource,
        isPackageWanted,
        setIsPackageWanted,
        isDirectDonation,
        setisDirectDonation,
        tenant,
        setTenant,
        selectedProjects,
        setSelectedProjects,
        allProjects,
        allowTaxDeductionChange,
        setallowTaxDeductionChange,
        donationUid,
        setDonationUid,
        setShowErrorCard,
        loadSelectedProjects,
        transferDetails,
        setTransferDetails,
        hideTaxDeduction,
        sethideTaxDeduction,
        queryToken,
        setqueryToken,
        isSignedUp,
        setIsSignedUp,
        frequency,
        setfrequency,
        profile,
        setprofile,
        hideLogin,
        setHideLogin,
        paymentError,
        setPaymentError,
        amount,
        setAmount,
        taxIdentificationAvail,
        setTaxIdentificationAvail,
        retainQuantityValue,
        setRetainQuantityValue,
        loadPaymentSetup,
        isPlanetCashActive,
        setIsPlanetCashActive,
        onBehalf,
        setOnBehalf,
        onBehalfDonor,
        setOnBehalfDonor,
        donation,
        setDonation,
        paymentRequest,
        setPaymentRequest,
        isSupportedDonation,
        supportedProjectId,
        getDonationBreakdown,
        errors,
        setErrors,
      }}
    >
      {children}

      <ErrorCard
        showErrorCard={showErrorCard}
        setShowErrorCard={setShowErrorCard}
      />
      <ErrorPopup />
    </QueryParamContext.Provider>
  );
};

export default QueryParamProvider;

interface CardProps {
  showErrorCard: boolean;
  setShowErrorCard: Dispatch<SetStateAction<boolean>>;
}

function ErrorCard({
  showErrorCard,
  setShowErrorCard,
}: CardProps): ReactElement {
  const { t, ready } = useTranslation(["common"]);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (showErrorCard) {
      setTimeout(() => {
        setShowErrorCard(false);
      }, 5000);
    }
  }, [showErrorCard]);

  return showErrorCard ? (
    <div className={`${theme} test-donation-bar`} style={{ zIndex: 15 }}>
      {ready && t("errorOccurred")}
    </div>
  ) : (
    <></>
  );
}
