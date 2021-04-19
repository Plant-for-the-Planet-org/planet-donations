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
  treeSelectionOptions: [{
    treeCount:50,
    iconFile:Component
  }],
  contactDetails: {},
  setContactDetails: (value: {}) => {},
  country: "",
  setcountry: (value: "") => {},
  paymentSetup: {},
  currency: "",
  donationStep: 0,
  setdonationStep: (value: number) => {},
  projectDetails: {},
  treeCount: 50,
  settreeCount: (value: number) => {},
  language:'en', 
  setlanguage:  (value: string) => 'en'
});

export default function QueryParamProvider({ children }: any) {
  const router = useRouter();

  const [paymentSetup, setpaymentSetup] = useState<Object>({});

  const [projectDetails, setprojectDetails] = useState<Object>({});

  const [donationStep, setdonationStep] = useState(1);
  const [language, setlanguage] = useState('en');

  const [tenantkey, settenantkey] = useState('ten_I9TW3ncG')
  const [donationId, setdonationId] = useState(null);
  const [accessToken, setaccessToken] = useState(null);


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
    email: "",
    giftMessage: "",
    type: "",
  });

  const [contactDetails, setContactDetails] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    companyName: "",
  });

  const [country, setcountry] = useState("");
  const [currency, setcurrency] = useState("");
  const [returnTo, setreturnTo] = useState("");

  // Language = locale => Can be received from the URL, can also be set by the user, can be extracted from browser language

  React.useEffect(()=>{
    if(router.query.locale){
      setlanguage(router.query.locale);
      localStorage.setItem('locale',router.query.locale);
    }
  },[router.query.locale]);

  // Return URL = returnTo => This will be received from the URL params - this is where the user will be redirected after the donation is complete

  React.useEffect(()=>{
    if(router.query.returnTo){
      setreturnTo(router.query.returnTo)
    }
  },[router.query.returnTo]);

  // Project GUID = project => This will be received from the URL params - this is the project the for which the donation will happen

  React.useEffect(() => {
    async function loadPaymentSetup(projectGUID) {
      try {
        const paymentSetupData = await getRequest(
          `/app/projects/${projectGUID}/paymentOptions`
        );
        const project:ProjectTypes = await getRequest(
          `/app/projects/${projectGUID}?_scope=extended`
        );
        if (project.data) {
          setprojectDetails(project.data);
        }
        if (paymentSetupData.data) {
          setpaymentSetup(paymentSetupData.data);
          setcurrency(paymentSetupData.data.currency);
          setcountry(paymentSetupData.data.effectiveCountry);
        }
      } catch (err) {
        // console.log(err);
      }
    }
    if (router.query.project) {
      loadPaymentSetup(router.query.project);
    }
    else {
      loadPaymentSetup('proj_WZkyugryh35sMmZMmXCwq7YY');
    }
  }, [router.query.project]);

  // Country = country => This can be received from the URL, can also be set by the user, can be extracted from browser location (config API)

  React.useEffect(()=>{
    if(router.query.country){
      setcountry(router.query.country)
    }
  },[router.query.country]);

  // Donation ID = donationId => This will be received from the URL params

  React.useEffect(()=>{
    if(router.query.donationId){
      setdonationId(router.query.donationId)
    }
  },[router.query.donationId]);

  // support = s => Fetch the user data from api and load in gift details


  // Access token = accessToken => 

  React.useEffect(()=>{
    if(router.query.accessToken){
      setaccessToken(router.query.accessToken)
    }
  },[router.query.accessToken]);

  // Tenant key = tenantkey => 

  React.useEffect(()=>{
    if(router.query.tenantkey){
      settenantkey(router.query.tenantkey);
      localStorage.setItem('tenantkey',router.query.tenantkey);
    }
  },[router.query.tenantkey]);

  // Tree Count = treecount => Received from the URL

  React.useEffect(()=>{
    if(router.query.treecount){
      settreeCount(Number(router.query.treecount))
      if(![10,20,50,150].includes(Number(router.query.treecount))){
        // Set custom tree count true
      }
    }
  },[router.query.treecount])

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
        donationStep,
        setdonationStep,
        projectDetails,
        treeCount,
        settreeCount,
        language,
        setlanguage
      }}
    >
      {children}
    </QueryParamContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(QueryParamContext);
}
