import { useRouter } from "next/dist/client/router";
import React, { Component, useState } from "react";
import LeafIcon from "../../public/assets/icons/LeafIcon";
import PlantPotIcon from "../../public/assets/icons/PlantPotIcon";
import TreeIcon from "../../public/assets/icons/TreeIcon";
import TwoLeafIcon from "../../public/assets/icons/TwoLeafIcon";
import { ProjectTypes } from "../Common/Types";
import { getRequest } from "../Utils/api";

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
  donationStep: 0,
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
  isDirectDonation:false
});

export default function QueryParamProvider({ children }: any) {
  const router = useRouter();

  const [paymentSetup, setpaymentSetup] = useState<Object>({});

  const [projectDetails, setprojectDetails] = useState<Object | null>(null);

  const [donationStep, setdonationStep] = useState(1);
  const [language, setlanguage] = useState("en");

  const [tenantkey, settenantkey] = useState("ten_I9TW3ncG");
  const [donationID, setdonationID] = useState(null);
  const [accessToken, setaccessToken] = useState(null);

  // for tax deduction part
  const [isTaxDeductible, setIsTaxDeductible] = React.useState(false);

  const [isDirectDonation, setisDirectDonation] = React.useState(false);
  
  const [
    isPaymentOptionsLoading,
    setIsPaymentOptionsLoading,
  ] = React.useState<boolean>(false);

  const [paymentType, setPaymentType] = React.useState("");

  // const [directGift, setDirectGift] = React.useState(null);
  // React.useEffect(() => {
  //   const getdirectGift = localStorage.getItem('directGift');
  //   if (getdirectGift) {
  //     setDirectGift(JSON.parse(getdirectGift));
  //   }
  // }, []);
  // React.useEffect(() => {
  //   if (directGift) {
  //     setIsGift(true);
  //     setGiftDetails({
  //       type: 'direct',
  //       recipientName: directGift.displayName,
  //       email: null,
  //       giftMessage: '',
  //       recipientTreecounter: directGift.id,
  //       receipients: null,
  //     });
  //   } else {
  //     setIsGift(false);
  //     setGiftDetails({
  //       type: null,
  //       recipientName: null,
  //       email: null,
  //       giftMessage: '',
  //       recipientTreecounter: null,
  //       receipients: null,
  //     });
  //   }
  // }, [directGift]);

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

  // Language = locale => Can be received from the URL, can also be set by the user, can be extracted from browser language

  React.useEffect(() => {
    if (router.query.locale) {
      setlanguage(router.query.locale);
      localStorage.setItem("locale", router.query.locale);
    }
  }, [router.query.locale]);

  // Return URL = returnTo => This will be received from the URL params - this is where the user will be redirected after the donation is complete

  React.useEffect(() => {
    if (router.query.returnto) {
      setreturnTo(router.query.returnto);
    }
  }, [router.query.returnto]);

  // Project GUID = project => This will be received from the URL params - this is the project the for which the donation will happen
  async function loadProject(projectGUID: string) {
    try {
      const project: ProjectTypes = await getRequest(
        `/app/projects/${projectGUID}?_scope=extended`
      );
      if (project.data) {
        setprojectDetails(project.data);
      }
    } catch (err) {
      // console.log(err);
    }
  }

  React.useEffect(() => {
    if (router.query.project) {
      loadProject(router.query.project);
    } else {
      loadProject("proj_WZkyugryh35sMmZMmXCwq7YY");
    }
  }, [router.query.project]);

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
    if (router.query.project) {
      loadPaymentSetup(router.query.project);
    } else {
      loadPaymentSetup("proj_WZkyugryh35sMmZMmXCwq7YY");
    }
  }, [router.query.project, country]);

  // Country = country => This can be received from the URL, can also be set by the user, can be extracted from browser location (config API)

  React.useEffect(() => {
    if (router.query.country) {
      setcountry(router.query.country);
    }
  }, [router.query.country]);

  // Donation ID = donationid => This will be received from the URL params
  async function loadDonation() {
    const donation = await getRequest(
      `/app/donations/${router.query.donationid}`
    );

    if (donation.status === 200) {
      setdonationID(router.query.donationid);
      // if the donation is present means the donation is already created
      // Set shouldCreateDonation as false
      setshouldCreateDonation(false)
       // fetch project - payment setup
      loadProject(donation.data.project.id);
      loadPaymentSetup(donation.data.project.id);
      settreeCount(donation.data.treeCount);

      // Check if the donation status is paid or successful - if yes directly show thank you page
      // other payment statuses paymentStatus =  'refunded'; 'referred'; 'in-dispute'; 'dispute-lost';
      if(donation.data.paymentStatus === 'success' || donation.data.paymentStatus === 'paid' || donation.data.paymentStatus === 'failed' || donation.data.paymentStatus === 'pending'){
        setdonationStep(4)
      }
      else if(donation.data.paymentStatus === 'initiated' ){
        // Check if all contact details are present - if not send user to step 2 else step 3
        // Check if all payment cards are present - if yes then show it on step 3
        setisDirectDonation(true)
        setdonationStep(3)
      }

    } else {
      // SET Error that no donation is found
    }
  }
  React.useEffect(() => {
    if (router.query.donationid) {
      loadDonation();
    }
  }, [router.query.donationid]);

  // support = s => Fetch the user data from api and load in gift details

  // Access token = accessToken =>

  React.useEffect(() => {
    if (router.query.accesstoken) {
      setaccessToken(router.query.accesstoken);
    }
  }, [router.query.accesstoken]);

  // Tenant key = tenantkey =>

  React.useEffect(() => {
    if (router.query.tenantkey) {
      settenantkey(router.query.tenantkey);
      localStorage.setItem("tenantkey", router.query.tenantkey);
    }
  }, [router.query.tenantkey]);

  // Tree Count = treecount => Received from the URL

  React.useEffect(() => {
    if (router.query.treecount) {
      settreeCount(Number(router.query.treecount));
      if (![10, 20, 50, 150].includes(Number(router.query.treecount))) {
        // Set custom tree count true
      }
    }
  }, [router.query.treecount]);

  React.useEffect(() => {
    if (router.query.paymenttype) {
      setPaymentType(router.query.paymenttype);
    }
  }, [router.query.paymenttype]);

  React.useEffect(() => {
    if (router.query.redirect_status) {
      setredirectstatus(router.query.redirect_status);
    }
  }, [router.query.redirect_status]);

  // TO DO - Login user, fetch details and store default values for contact details

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
        isDirectDonation
      }}
    >
      {children}
    </QueryParamContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(QueryParamContext);
}
