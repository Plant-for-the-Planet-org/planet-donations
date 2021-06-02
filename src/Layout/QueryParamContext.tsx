import { useRouter } from "next/dist/client/router";
import React, { Component, useState } from "react";
import LeafIcon from "../../public/assets/icons/LeafIcon";
import PlantPotIcon from "../../public/assets/icons/PlantPotIcon";
import TreeIcon from "../../public/assets/icons/TreeIcon";
import TwoLeafIcon from "../../public/assets/icons/TwoLeafIcon";
import { ProjectTypes } from "../Common/Types";
import { getRequest } from "../Utils/api";
import { useTranslation } from "react-i18next";
import {
  getFilteredProjects,
  getRandomProjects,
} from "../Utils/projects/filterProjects";

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
});

export default function QueryParamProvider({ children }: any) {
  const router = useRouter();

  const { i18n } = useTranslation();

  const [paymentSetup, setpaymentSetup] = useState<Object>({});

  const [projectDetails, setprojectDetails] = useState<Object | null>(null);

  const [donationStep, setdonationStep] = useState<null | number>(null);
  const [language, setlanguage] = useState("en");

  const [donationID, setdonationID] = useState(null);
  const [tenant, settenant] = useState("ten_I9TW3ncG");

  // for tax deduction part
  const [isTaxDeductible, setIsTaxDeductible] = React.useState(false);

  const [isDirectDonation, setisDirectDonation] = React.useState(false);

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

  const [country, setcountry] = useState("");
  const [currency, setcurrency] = useState("");
  const [returnTo, setreturnTo] = useState("");

  const [redirectstatus, setredirectstatus] = useState(null);

  const [shouldCreateDonation, setshouldCreateDonation] = useState(false);

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);

  // Language = locale => Can be received from the URL, can also be set by the user, can be extracted from browser language

  React.useEffect(() => {
    if (router.query.locale) {
      setlanguage(router.query.locale);
    }
  }, [router.query.locale]);

  React.useEffect(() => {
    if (router.locale) {
      setlanguage(router.locale);
    }
  }, [router.locale]);

  React.useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language); // value name also used by i18n
  }, [language]);

  // Return URL = returnTo => This will be received from the URL params - this is where the user will be redirected after the donation is complete

  React.useEffect(() => {
    if (router.query.return_to) {
      setreturnTo(router.query.return_to);
    }
  }, [router.query.return_to]);

  // Project GUID = project => This will be received from the URL params - this is the project the for which the donation will happen
  async function loadProject(projectGUID: string) {
    try {
      const project: ProjectTypes = await getRequest(
        `/app/projects/${projectGUID}`
      );
      if (project.data) {
        setprojectDetails(project.data);
      }
    } catch (err) {
      // console.log(err);
    }
  }

  async function loadselectedProjects() {
    try {
      const projects = await getRequest(`/app/projects?_scope=map`);
      if (projects.data) {
        console.log("projects.data", projects.data);

        setAllProjects(projects.data);
        // const allowedDonationsProjects = getFilteredProjects(projects.data,'allow');
        const featuredProjects = getFilteredProjects(projects.data, "featured");
        if (featuredProjects?.length < 6) {
          setSelectedProjects(selectedProjects);
        } else {
          const randomProjects = getRandomProjects(featuredProjects, 6);
          setSelectedProjects(randomProjects);
        }
      }
    } catch (err) {
      // console.log(err);
    }
  }

  React.useEffect(() => {
    if (router.isReady) {
      if (router.query.to && !router.query.context) {
        loadProject(router.query.to);
        setdonationStep(1);
      } else {
        if (!router.query.context) {
          loadselectedProjects();
          setdonationStep(0);
        }
      }
    }
  }, [router.query.to, router.isReady]);

  async function loadPaymentSetup(projectGUID) {
    setIsPaymentOptionsLoading(true);
    try {
      const paymentSetupData = await getRequest(
        `/app/projects/${projectGUID}/paymentOptions?country=${country}`
      );
      if (paymentSetupData.data) {
        setpaymentSetup(paymentSetupData.data);
        setcurrency(paymentSetupData.data.currency);
        if (!country) {
          setcountry(paymentSetupData.data.effectiveCountry);
        }
      }
      setIsPaymentOptionsLoading(false);
    } catch (err) {
      // console.log(err);
    }
  }

  React.useEffect(() => {
    if (router.query.to && country) {
      loadPaymentSetup(router.query.to);
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
      const config = await getRequest(`/public/v1.2/${userLang}/config`);
      if (config.data) {
        setcountry(config.data.country);
        setContactDetails({
          ...contactDetails,
          city:
            config.data.loc && config.data.loc.city ? config.data.loc.city : "",
          zipCode:
            config.data.loc && config.data.loc.postalCode
              ? config.data.loc.postalCode
              : "",
        });
      }
    } catch (err) {
      // console.log(err);
    }
  }

  React.useEffect(() => {
    loadConfig();
  }, []);

  // Country = country => This can be received from the URL, can also be set by the user, can be extracted from browser location (config API)

  React.useEffect(() => {
    if (router.query.country) {
      setcountry(router.query.country);
    }
  }, [router.query.country]);

  // Donation ID = donationid => This will be received from the URL params
  async function loadDonation() {
    const donation = await getRequest(`/app/donations/${router.query.context}`);

    if (donation.status === 200) {
      setdonationID(router.query.context);
      // if the donation is present means the donation is already created
      // Set shouldCreateDonation as false
      setshouldCreateDonation(false);
      // fetch project - payment setup
      await loadProject(donation.data.project.id);
      await loadPaymentSetup(donation.data.project.id);
      settreeCount(donation.data.treeCount);

      // We can also take taxdeduction country from here 
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
      } else if (donation.data.paymentStatus === "initiated") {
        // Check if all contact details are present - if not send user to step 2 else step 3
        // Check if all payment cards are present - if yes then show it on step 3
        setisDirectDonation(true);
        setdonationStep(3);
      }
    } else {
      // SET Error that no donation is found
    }
  }
  React.useEffect(() => {
    if (router.query.context) {
      loadDonation();
    }
  }, [router.query.context]);

  // support = s => Fetch the user data from api and load in gift details
  async function loadPublicUserData(slug: any) {
    const newProfile = await getRequest(`/app/profiles/${slug}`);
    if (newProfile.data.type !== "tpo") {
      setisGift(true);
      setgiftDetails({
        recipientName: newProfile.data.displayName,
        recipientEmail: "",
        giftMessage: "",
        type: "direct",
        recipientTreecounter: newProfile.data.slug,
      });
    }
  }

  React.useEffect(() => {
    if (router && router.query.s) {
      loadPublicUserData(router.query.s);
    }
  }, [router.query.s]);

  React.useEffect(() => {
    if (router.query.tenant) {
      settenant(router.query.tenant);
      localStorage.setItem("tenant", router.query.tenant);
    } else{
      localStorage.removeItem("tenant");
    }
    return ()=>{
      localStorage.removeItem("tenant");
    }
  }, [router.query.tenant]);

  // Tree Count = treecount => Received from the URL

  React.useEffect(() => {
    if (router.query.trees) {
      settreeCount(Number(router.query.trees));
    }
  }, [router.query.trees]);

  React.useEffect(() => {
    if (router.query.method) {
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
      }}
    >
      {children}
    </QueryParamContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(QueryParamContext);
}
