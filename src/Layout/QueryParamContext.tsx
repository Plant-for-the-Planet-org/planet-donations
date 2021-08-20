import { useRouter } from "next/dist/client/router";
import React, { Component, useState, ReactElement } from "react";
import LeafIcon from "../../public/assets/icons/LeafIcon";
import PlantPotIcon from "../../public/assets/icons/PlantPotIcon";
import TreeIcon from "../../public/assets/icons/TreeIcon";
import TwoLeafIcon from "../../public/assets/icons/TwoLeafIcon";
import { apiRequest } from "../Utils/api";
import { useTranslation } from "next-i18next";
import { getRandomProjects } from "../Utils/projects/filterProjects";
import { ThemeContext } from "../../styles/themeContext";
import countriesData from "../Utils/countriesData.json";

export const QueryParamContext = React.createContext({
  isGift: false,
  setisGift: (value: boolean) => {},
  giftDetails: {},
  setgiftDetails: (value: {}) => {},
  treeSelectionOptions: [
    {
      treeCount: 50,
      iconFile: Component,
    },
  ],
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
  treeCount: 50,
  settreeCount: (value: number) => {},
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
  loadselectedProjects: () => {},
  hideTaxDeduction: false,
  queryToken: "",
  setqueryToken: (value: string) => "",
  sethideTaxDeduction: (value: boolean) => {},
  setisDirectDonation: (value: boolean) => {},
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

  const treeSelectionOptions = [
    {
      treeCount: 10,
      iconFile: <LeafIcon />,
    },
    {
      treeCount: 20,
      iconFile: <TwoLeafIcon />,
    },
    {
      treeCount: 50,
      iconFile: <PlantPotIcon />,
    },
    {
      treeCount: 150,
      iconFile: <TreeIcon />,
    },
  ];
  const [treeCount, settreeCount] = useState(50);

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

  // Language = locale => Can be received from the URL, can also be set by the user, can be extracted from browser language

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
      }
      setIsPaymentOptionsLoading(false);
    } catch (err) {
      // console.log(err);
    }
  }

  React.useEffect(() => {
    if (router.query.to && country) {
      loadPaymentSetup(router.query.to, country);
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
        url: `/public/v1.2/${userLang}/config`,
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
            setcountry(config.data.country.toUpperCase());
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
        settreeCount(Number(router.query.trees));
      } else {
        settreeCount(50);
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
    treeCount,
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

  return (
    <QueryParamContext.Provider
      value={{
        isGift,
        setisGift,
        giftDetails,
        setgiftDetails,
        treeSelectionOptions,
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
        treeCount,
        settreeCount,
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
