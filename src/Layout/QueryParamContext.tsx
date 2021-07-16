import { useRouter } from "next/dist/client/router";
import React, { Component, useState, ReactElement } from "react";
import LeafIcon from "../../public/assets/icons/LeafIcon";
import PlantPotIcon from "../../public/assets/icons/PlantPotIcon";
import TreeIcon from "../../public/assets/icons/TreeIcon";
import TwoLeafIcon from "../../public/assets/icons/TwoLeafIcon";
import { ProjectTypes } from "../Common/Types";
import { apiRequest } from "../Utils/api";
import { useTranslation } from "next-i18next";
import {
  getRandomProjects,
} from "../Utils/projects/filterProjects";
import { ThemeContext } from "../../styles/themeContext";

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
  donationUid: null,
  setDonationUid: (value: string) => "",
  setshowErrorCard: (value: boolean) => {},
  setprojectDetails: (value: {}) => {},
  loadselectedProjects: () => {},
  hideTaxDeduction: false,
  queryToken:"", 
  setqueryToken: (value: string) => ""
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

  const [hideTaxDeduction, sethideTaxDeduction] = useState(false)

  // Language = locale => Can be received from the URL, can also be set by the user, can be extracted from browser language

  React.useEffect(() => {
    if (router.query.locale) {
      setlanguage(router.query.locale);
    }
  }, [router.query.locale]);

  React.useEffect(() => {    
    if(i18n && i18n.isInitialized){
      i18n.changeLanguage(language);
      localStorage.setItem("language", language);
    }
  }, [language,router]);

  // Return URL = returnTo => This will be received from the URL params - this is where the user will be redirected after the donation is complete

  function testURL(url: string) {
    let pattern = new RegExp(
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

  // Project GUID = project => This will be received from the URL params - this is the project the for which the donation will happen
  async function loadProject(projectGUID: string) {
    try {
      const requestParams = {
        url: `/app/projects/${projectGUID}`,
        setshowErrorCard,
      };
      const project: ProjectTypes = await apiRequest(requestParams);
      if (project.data) {
        setprojectDetails(project.data);
      }
    } catch (err) {
      loadselectedProjects();
      setdonationStep(0);
    }
  }

  async function loadselectedProjects() {
    try {
      const requestParams = {
        url: `/app/projects?_scope=map`,
        setshowErrorCard,
      };
      const projects: any = await apiRequest(requestParams);
      if (projects.data) {
        let allowedDonationsProjects = projects.data.filter(
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
          setcountry(config.data.country);
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

  // Country = country => This can be received from the URL, can also be set by the user, can be extracted from browser location (config API)

  React.useEffect(() => {
    if (router.query.country) {
      setcountry(router.query.country);
    }
  }, [router.query.country]);

  // Donation ID = donationid => This will be received from the URL params
  async function loadDonation() {
    try {
      const requestParams = {
        url: `/app/donations/${router.query.context}`,
        setshowErrorCard,
      };
      const donation: any = await apiRequest(requestParams);

      if (donation.status === 200) {
        setdonationID(router.query.context);
        // if the donation is present means the donation is already created
        // Set shouldCreateDonation as false
        setshouldCreateDonation(false);
        // fetch project - payment setup
        await loadProject(donation.data.project.id);


        if (donation.data.taxDeductionCountry) {
          setcountry(donation.data.taxDeductionCountry);
          setIsTaxDeductible(true);
          await loadPaymentSetup(
            donation.data.project.id,
            donation.data.taxDeductionCountry
          );
        } else {
          sethideTaxDeduction(true);
          const newcountry = donation.data.donor.country;          
          setcountry(newcountry);
          await loadPaymentSetup(donation.data.project.id, newcountry);
        }

        setallowTaxDeductionChange(false);

        settreeCount(donation.data.treeCount);
        if (donation.data.donor) {
          let contactDetails = {
            firstname: donation.data.donor.firstname
              ? donation.data.donor.firstname
              : "",
            lastname: donation.data.donor.lastname
              ? donation.data.donor.lastname
              : "",
            email: donation.data.donor.email ? donation.data.donor.email : "",
            address: donation.data.donor.address
              ? donation.data.donor.address
              : "",
            city: donation.data.donor.city ? donation.data.donor.city : "",
            zipCode: donation.data.donor.zipCode
              ? donation.data.donor.zipCode
              : "",
            country: donation.data.donor.country
              ? donation.data.donor.country
              : "",
            companyname: donation.data.donor.companyname
              ? donation.data.donor.companyname
              : "",
          };
          setContactDetails(contactDetails);
        }

        // Check if the donation status is paid or successful - if yes directly show thank you page
        // other payment statuses paymentStatus =  'refunded'; 'referred'; 'in-dispute'; 'dispute-lost';
        if (
          (router.query.method === "Sofort" ||
            router.query.method === "Giropay") &&
          (router.query.redirect_status === "succeeded" ||
            router.query.redirect_status === "failed") &&
          router.query.payment_intent
        ) {
          setdonationStep(4);
        } else if (
          donation.data.paymentStatus === "success" ||
          donation.data.paymentStatus === "paid" ||
          donation.data.paymentStatus === "failed" ||
          donation.data.paymentStatus === "pending"
        ) {
          setdonationStep(4);
        } else if (
          donation.data.paymentStatus === "initiated" ||
          donation.data.paymentStatus === "draft"
        ) {
          // Check if all contact details are present - if not send user to step 2 else step 3
          // Check if all payment cards are present - if yes then show it on step 3
          setisDirectDonation(true);
          setdonationStep(3);
        }
      } else {
        // SET Error that no donation is found
        setdonationStep(1);
      }
    } catch (err) {
      loadselectedProjects();
      setdonationStep(0);
    }
  }
  React.useEffect(() => {
    if (router.query.context) {
      loadDonation();
    }
  }, [router.query.context]);

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
        setqueryToken
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
    <div className={`${theme} test-donation-bar`} style={{zIndex:15}}>{t("errorOccurred")}</div>
  ) : (
    <></>
  );
}

export function useTheme() {
  return React.useContext(QueryParamContext);
}
