import { useRouter } from "next/dist/client/router";
import React, { useState, ReactElement } from "react";
import { apiRequest } from "../Utils/api";
import { useTranslation } from "next-i18next";
import { getRandomProjects } from "../Utils/projects/filterProjects";
import { ThemeContext } from "../../styles/themeContext";
import countriesData from "../Utils/countriesData.json";
import { setCountryCode } from "src/Utils/setCountryCode";
import { THANK_YOU } from "src/Utils/donationStepConstants";
import { PaymentSetupProps } from "src/Common/Types";
import {
  PaymentSetup,
  giftDetails,
  paymentSetupData,
  Profile,
  ProjectDetails,
  projects,
  onBehalfDonar,
} from "src/Donations/PaymentMethods/Interfaces";

export const QueryParamContext = React.createContext({
  isGift: false,
  setisGift: (value: boolean) => {},
  giftDetails: {},
  setgiftDetails: (value: {}) => {},
  contactDetails: {},
  setContactDetails: (value: {}) => {},
  country: "",
  setcountry: (value: "") => {},
  paymentSetup: {},
  setpaymentSetup: (value: PaymentSetup) => {},
  currency: "",
  setcurrency: (value: "") => {},
  donationStep: null,
  setdonationStep: (value: number) => {},
  projectDetails: null,
  quantity: 50,
  setquantity: (value: number) => {},
  language: "en",
  setlanguage: (value: string) => {},
  donationID: null,
  setdonationID: (value: string) => {},
  paymentType: "",
  setPaymentType: (value: string) => "",
  shouldCreateDonation: false,
  setshouldCreateDonation: (value: boolean) => {},
  setIsTaxDeductible: (value: boolean) => {},
  isTaxDeductible: false,
  isPaymentOptionsLoading: false,
  redirectstatus: "",
  setredirectstatus: (value: string) => {},
  callbackUrl: "",
  setcallbackUrl: (value: string) => {},
  isDirectDonation: false,
  tenant: "",
  settenant: (value: string) => {},
  selectedProjects: [],
  setSelectedProjects: (value: Array<any>) => {},
  allProjects: [],
  allowTaxDeductionChange: true,
  setallowTaxDeductionChange: (value: boolean) => {},
  donationUid: null,
  setDonationUid: (value: string) => "",
  setshowErrorCard: (value: boolean) => {},
  setprojectDetails: (value: {}) => {},
  transferDetails: null,
  setTransferDetails: (value: {}) => {},
  loadselectedProjects: () => {},
  hideTaxDeduction: false,
  queryToken: "",
  setqueryToken: (value: string) => "",
  sethideTaxDeduction: (value: boolean) => {},
  setisDirectDonation: (value: boolean) => {},
  isSignedUp: false,
  setIsSignedUp: (value: boolean) => {},
  frequency: "",
  setfrequency: (value: string) => {},
  hideLogin: false,
  setHideLogin: (value: boolean) => {},
  paymentError: "",
  setPaymentError: (value: string) => {},
  amount: null,
  setAmount: (value: number) => {},
  taxIdentificationAvail: {},
  setTaxIdentificationAvail: (value: boolean) => {},
  callbackMethod: "",
  setCallbackMethod: (value: string) => {},
  retainQuantityValue: false,
  setRetainQuantityValue: (value: boolean) => {},
  projectName: "",
  setProjectName: (value: string) => {},
  projectDescription: "",
  setProjectDescription: (value: string) => {},
  setIsPaymentOptionsLoading: (value: boolean) => {},
  loadPaymentSetup: (value: {
    projectGUID: string;
    paymentSetupCountry: string | string[];
    shouldSetPaymentDetails?: boolean;
  }) => {},
  profile: null,
  isPlanetCashActive: false,
  setIsPlanetCashActive: (value: boolean) => {},
  onBehalf: false,
  setOnBehalf: (value: boolean) => {},
  onBehalfDonor: {},
  setOnBehalfDonor: (value: {}) => {},
  donation: null,
  setdonation: (value: {}) => {},
  paymentRequest: null,
  setPaymentRequest: (value: {}) => {},
});

export default function QueryParamProvider({ children }: any) {
  const router = useRouter();

  const { i18n } = useTranslation();

  const [paymentSetup, setpaymentSetup] = useState<PaymentSetupProps | {}>({});

  const [projectDetails, setprojectDetails] = useState<ProjectDetails | null>(
    null
  );

  // Query token is the access token which is passed in the query params
  const [queryToken, setqueryToken] = useState<string | null>(null);

  const [donationStep, setdonationStep] = useState<null | number>(null);
  const [language, setlanguage] = useState(
    typeof window !== "undefined" && localStorage.getItem("language")
      ? localStorage.getItem("language")
      : "en"
  );

  const [donationID, setdonationID] = useState(null);
  const [tenant, settenant] = useState("ten_I9TW3ncG");

  // for tax deduction part
  const [isTaxDeductible, setIsTaxDeductible] = React.useState(false);
  const [allowTaxDeductionChange, setallowTaxDeductionChange] = useState(true);

  const [isDirectDonation, setisDirectDonation] = React.useState(false);

  const [donationUid, setDonationUid] = useState(null);

  const [isPaymentOptionsLoading, setIsPaymentOptionsLoading] =
    React.useState<boolean>(false);

  const [paymentType, setPaymentType] = React.useState("");

  const [quantity, setquantity] = useState(50);
  const [frequency, setfrequency] = useState<null | string>("once");

  const [isGift, setisGift] = useState<boolean>(false);
  const [giftDetails, setgiftDetails] = useState<giftDetails>({
    recipientName: "",
    recipientEmail: "",
    giftMessage: "",
    type: "",
  });

  const [contactDetails, setContactDetails] = React.useState({
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

  const [country, setcountry] = useState<string | string[]>("");
  const [currency, setcurrency] = useState("");
  const [callbackUrl, setcallbackUrl] = useState("");
  const [taxIdentificationAvail, setTaxIdentificationAvail] = useState(false);
  const [callbackMethod, setCallbackMethod] = useState("");

  const [redirectstatus, setredirectstatus] = useState(null);

  const [shouldCreateDonation, setshouldCreateDonation] = useState(false);

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);

  const [hideTaxDeduction, sethideTaxDeduction] = useState(false);

  const [profile, setprofile] = React.useState<null | Profile>(null);
  const [amount, setAmount] = React.useState<null | number>(null);
  const [retainQuantityValue, setRetainQuantityValue] =
    React.useState<boolean>(false);
  // Language = locale => Can be received from the URL, can also be set by the user, can be extracted from browser language
  const [isSignedUp, setIsSignedUp] = React.useState<boolean>(false);

  const [hideLogin, setHideLogin] = React.useState<boolean>(false);
  const [paymentError, setPaymentError] = React.useState("");
  const [transferDetails, setTransferDetails] = React.useState<{} | null>(null);
  const [projectName, setProjectName] = React.useState("");
  const [projectDescription, setProjectDescription] = React.useState("");

  const [isPlanetCashActive, setIsPlanetCashActive] = useState(false);

  // Only used when planetCash is active
  const [onBehalf, setOnBehalf] = useState(false);

  const [onBehalfDonor, setOnBehalfDonor] = useState<onBehalfDonar>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [donation, setdonation] = React.useState(null);
  const [paymentRequest, setPaymentRequest] = React.useState(null);

  React.useEffect(() => {
    if (paymentError) {
      router.replace({
        query: { ...router.query, step: THANK_YOU },
      });
    }
  }, [paymentError]);
  React.useEffect(() => {
    if (router.query.locale) {
      setlanguage(router.query.locale);
    }
  }, [router.query.locale]);

  React.useEffect(() => {
    if (i18n && i18n.isInitialized) {
      i18n.changeLanguage(language);
      localStorage.setItem("language", language);
    }
  }, [language, router]);

  // Return URL = callbackUrl => This will be received from the URL params - this is where the user will be redirected after the donation is complete

  function testURL(url: string) {
    const pattern = new RegExp(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
    );
    // regex source https://tutorial.eyehunts.com/js/url-regex-validation-javascript-example-code/
    return !!pattern.test(url);
  }
  React.useEffect(() => {
    if (router.query.callback_url) {
      if (testURL(router.query.callback_url)) {
        setcallbackUrl(router.query.callback_url);
      }
    }
  }, [router.query.callback_url]);

  React.useEffect(() => {
    if (router.query.callback_method) {
      setCallbackMethod(router.query.callback_method);
    }
  }, [router.query.callback_method]);

  React.useEffect(() => {
    if (
      paymentSetup?.frequencies &&
      Object.keys(paymentSetup.frequencies).length === 2
    ) {
      setfrequency(Object.keys(paymentSetup?.frequencies)[0]);
    }
    setRetainQuantityValue(false);
  }, [paymentSetup]);

  async function loadselectedProjects() {
    try {
      const requestParams = {
        url: `/app/projects?_scope=map`,
        setshowErrorCard,
        tenant,
      };
      const projects: projects = await apiRequest(requestParams);

      if (projects.data) {
        const allowedDonationsProjects = projects.data.filter(
          (project: { properties: { allowDonations: boolean } }) =>
            project.properties.allowDonations === true
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
      // console.log(err);
    }
  }

  React.useEffect(() => {
    if (router.query.to && country !== undefined && country !== "") {
      const to = String(router.query.to).replace(/\//g, "");
      loadPaymentSetup({
        projectGUID: to,
        paymentSetupCountry: country,
        shouldSetPaymentDetails: true,
      });
    }
  }, [router.query.to, country]);

  async function loadConfig() {
    try {
      const requestParams = {
        url: `/app/config`,
        setshowErrorCard,
        shouldQueryParamAdd: false,
      };
      const config: {} = await apiRequest(requestParams);
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
                configCountry: config.data.country.toUpperCase(),
              });
            }
          }
        }
        if (!router.query.context) {
          setContactDetails({
            ...contactDetails,
            city:
              config.data.loc && config.data.loc.city
                ? config.data.loc.city
                : "",
            zipCode:
              config.data.loc && config.data.loc.postalCode
                ? config.data.loc.postalCode
                : "",
          });
        }
      }
    } catch (err) {
      // console.log(err);
    }
  }

  React.useEffect(() => {
    if (router.isReady) {
      loadConfig();
    }
  }, [router.isReady]);

  // Tree Count = treecount => Received from the URL
  React.useEffect(() => {
    if (router.query.units) {
      // Do not allow 0 or negative numbers and string
      if (Number(router.query.units) > 0 && paymentSetup.unitCost) {
        setquantity(Number(router.query.units));
      }
    }
    setRetainQuantityValue(false);
  }, [router.query.units, paymentSetup]);

  React.useEffect(() => {
    if (router.query.method) {
      // TODO => only allow the ones which we use, add an array and check if it exists in that array
      setPaymentType(router.query.method);
    }
  }, [router.query.method]);

  React.useEffect(() => {
    if (router.query.redirect_status) {
      setredirectstatus(router.query.redirect_status);
    }
  }, [router.query.redirect_status]);

  React.useEffect(() => {
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
    isTaxDeductible,
  ]);

  const [showErrorCard, setshowErrorCard] = React.useState(false);
  React.useEffect(() => {
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
    paymentSetupCountry: string | string[];
    shouldSetPaymentDetails?: boolean;
  }) => {
    setIsPaymentOptionsLoading(true);
    try {
      const requestParams = {
        url: `/app/paymentOptions/${projectGUID}?country=${paymentSetupCountry}`,
        setshowErrorCard,
        tenant,
      };
      const paymentSetupData: paymentSetupData = await apiRequest(
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
        setprojectDetails({
          id: paymentSetup.id,
          name: paymentSetup.name,
          description: paymentSetup.description,
          purpose: paymentSetup.purpose,
          ownerName: paymentSetup.ownerName,
          taxDeductionCountries: paymentSetup.taxDeductionCountries,
          projectImage: paymentSetup.image,
          ownerAvatar: paymentSetup.ownerAvatar,
        });
      }
      setIsPaymentOptionsLoading(false);
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <QueryParamContext.Provider
      value={{
        isGift,
        setisGift,
        giftDetails,
        setgiftDetails,
        contactDetails,
        setContactDetails,
        country,
        setcountry,
        paymentSetup,
        currency,
        setcurrency,
        donationStep,
        setdonationStep,
        projectDetails,
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
        redirectstatus,
        setredirectstatus,
        callbackUrl,
        setcallbackUrl,
        isDirectDonation,
        tenant,
        settenant,
        selectedProjects,
        setSelectedProjects,
        allProjects,
        allowTaxDeductionChange,
        donationUid,
        setDonationUid,
        setshowErrorCard,
        setprojectDetails,
        loadselectedProjects,
        hideTaxDeduction,
        queryToken,
        setqueryToken,
        setpaymentSetup,
        sethideTaxDeduction,
        setallowTaxDeductionChange,
        setisDirectDonation,
        profile,
        setprofile,
        isSignedUp,
        setIsSignedUp,
        frequency,
        setfrequency,
        hideLogin,
        setHideLogin,
        paymentError,
        setPaymentError,
        amount,
        setAmount,
        transferDetails,
        setTransferDetails,
        taxIdentificationAvail,
        setTaxIdentificationAvail,
        callbackMethod,
        setCallbackMethod,
        retainQuantityValue,
        setRetainQuantityValue,
        projectDescription,
        projectName,
        setProjectName,
        setProjectDescription,
        setIsPaymentOptionsLoading,
        loadPaymentSetup,
        isPlanetCashActive,
        setIsPlanetCashActive,
        onBehalf,
        setOnBehalf,
        onBehalfDonor,
        setOnBehalfDonor,
        donation,
        setdonation,
        paymentRequest,
        setPaymentRequest,
      }}
    >
      {children}

      <ErrorCard
        showErrorCard={showErrorCard}
        setShowErrorCard={setshowErrorCard}
      />
    </QueryParamContext.Provider>
  );
}

interface CardProps {
  showErrorCard: boolean;
  setShowErrorCard: (...args: unknown[]) => unknown;
}

function ErrorCard({
  showErrorCard,
  setShowErrorCard,
}: CardProps): ReactElement {
  const { t } = useTranslation(["common"]);

  const { theme } = React.useContext(ThemeContext);

  React.useEffect(() => {
    if (showErrorCard) {
      setTimeout(() => {
        setShowErrorCard(false);
      }, 3000);
    }
  }, [showErrorCard]);

  return showErrorCard ? (
    <div className={`${theme} test-donation-bar`} style={{ zIndex: 15 }}>
      {t("errorOccurred")}
    </div>
  ) : (
    <></>
  );
}

export function useTheme() {
  return React.useContext(QueryParamContext);
}
