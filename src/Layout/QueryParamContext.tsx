import { useRouter } from "next/dist/client/router";
import React, { useState, ReactElement, useEffect } from "react";
import { apiRequest } from "../Utils/api";
import { useTranslation } from "next-i18next";
import { getRandomProjects } from "../Utils/projects/filterProjects";
import { ThemeContext } from "../../styles/themeContext";
import countriesData from "../Utils/countriesData.json";
import { THANK_YOU } from "src/Utils/donationStepConstants";

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
  setpaymentSetup: ({}) => {},
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
  returnTo: "",
  isDirectDonation: false,
  tenant: "",
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
});

export default function QueryParamProvider({ children }: any) {
  const router = useRouter();

  const { i18n } = useTranslation();

  const [paymentSetup, setpaymentSetup] = useState<Object>({});

  const [projectDetails, setprojectDetails] = useState<Object | null>(null);

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
  const [giftDetails, setgiftDetails] = useState<object>({
    recipientName: "",
    recipientEmail: "",
    giftMessage: "",
    type: "",
  });

  const [contactDetails, setContactDetails] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    companyname: "",
  });

  const [country, setcountry] = useState<string | string[]>("");
  const [currency, setcurrency] = useState("");
  const [returnTo, setreturnTo] = useState("");

  const [redirectstatus, setredirectstatus] = useState(null);

  const [shouldCreateDonation, setshouldCreateDonation] = useState(false);

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);

  const [hideTaxDeduction, sethideTaxDeduction] = useState(false);

  const [profile, setprofile] = React.useState<null | Object>(null);
  const [amount, setAmount] = React.useState<null | number>(null);

  // Language = locale => Can be received from the URL, can also be set by the user, can be extracted from browser language
  const [isSignedUp, setIsSignedUp] = React.useState<boolean>(false);

  const [hideLogin, setHideLogin] = React.useState<boolean>(false);
  const [paymentError, setPaymentError] = React.useState("");
  const [transferDetails, setTransferDetails] = React.useState<Object | null>(
    null
  );

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

  // Return URL = returnTo => This will be received from the URL params - this is where the user will be redirected after the donation is complete

  function testURL(url: string) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(url);
  }
  React.useEffect(() => {
    if (router.query.return_to) {
      if (testURL(router.query.return_to)) {
        setreturnTo(router.query.return_to);
      }
    }
  }, [router.query.return_to]);

  React.useEffect(() => {
    if (paymentSetup?.costIsMonthly) {
      setfrequency("monthly");
    }
  }, [paymentSetup]);

  async function loadselectedProjects() {
    try {
      const requestParams = {
        url: `/app/projects?_scope=map`,
        setshowErrorCard,
      };
      const projects: any = await apiRequest(requestParams);
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

  async function loadPaymentSetup(
    projectGUID: string | string[],
    paymentSetupCountry: string
  ) {
    setIsPaymentOptionsLoading(true);
    try {
      const requestParams = {
        url: `/app/projects/${projectGUID}/paymentOptions?country=${paymentSetupCountry}`,
        setshowErrorCard,
      };
      const paymentSetupData: any = await apiRequest(requestParams);
      if (paymentSetupData.data) {
        setcurrency(paymentSetupData.data.currency);
        if (!country) {
          setcountry(paymentSetupData.data.effectiveCountry);
        }

        setpaymentSetup(paymentSetupData.data);
        console.log(paymentSetupData.data, "paymentSetupData.data");
      }
      setIsPaymentOptionsLoading(false);
    } catch (err) {
      // console.log(err);
    }
  }

  React.useEffect(() => {
    if (router.query.to && country) {
      const to = String(router.query.to).replace(/\//g, "");
      loadPaymentSetup(to, country);
    }
  }, [router.query.to, country]);

  async function loadConfig() {
    let userLang;
    if (localStorage) {
      userLang = localStorage.getItem("language") || "en";
    } else {
      userLang = "en";
    }
    try {
      const requestParams = {
        url: `/app/config`,
        setshowErrorCard,
      };
      const config: any = await apiRequest(requestParams);
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
              setcountry(config.data.country.toUpperCase());
            }
          } else {
            setcountry("DE");
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

  React.useEffect(() => {
    if (router.query.tenant) {
      // TODO => verify tenant before setting it
      settenant(router.query.tenant);
      localStorage.setItem("tenant", router.query.tenant);
    } else {
      localStorage.removeItem("tenant");
    }
    return () => {
      localStorage.removeItem("tenant");
    };
  }, [router.query.tenant]);

  // Tree Count = treecount => Received from the URL
  React.useEffect(() => {
    if (router.query.trees) {
      // Do not allow 0 or negative numbers and string
      if (Number(router.query.trees) > 0) {
        setquantity(Number(router.query.trees));
      } else {
        setquantity(50);
      }
    }
  }, [router.query.trees]);

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
        returnTo,
        isDirectDonation,
        tenant,
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
  setShowErrorCard: Function;
}

function ErrorCard({
  showErrorCard,
  setShowErrorCard,
}: CardProps): ReactElement {
  const { t, ready } = useTranslation(["common"]);

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
