import { useRouter } from "next/dist/client/router";
import React, { Component, useState } from "react";
import LeafIcon from "../../public/assets/icons/LeafIcon";
import PlantPotIcon from "../../public/assets/icons/PlantPotIcon";
import TreeIcon from "../../public/assets/icons/TreeIcon";
import TwoLeafIcon from "../../public/assets/icons/TwoLeafIcon";
import { getRequest } from "../Utils/api";

export const QueryParamContext = React.createContext({
  isGift: false,
  setisGift: (value: boolean) => {},
  giftDetails: {},
  setgiftDetails: (value: {}) => {},
  treeSelectionOptions: [],
  contactDetails: {},
  setContactDetails: (value: {}) => {},
  country: "",
  setcountry: (value: "") => {},
  paymentSetup: {},
  currency:""
});

export default function QueryParamProvider({ children }: any) {
  const router = useRouter();

  const [paymentSetup, setpaymentSetup] = useState<null | Object>(
    null
  );

  // PARAMS that can be received and managed
  // Language => Can be received from the URL, can also be set by the user, can be extracted from browser language
  // Organisation URL => This will be received from the URL params - this goes back to the organisation's page
  // Return URL => This will be received from the URL params - this is where the user will be redirected after the donation is complete
  // Project ID => This will be received from the URL params - this is the project the for which the donation will happen
  // Country => This can be received from the URL, can also be set by the user, can be extracted from browser location (config API)
  // Transaction ID => This will be received from the URL params
  // isGift =>
  // Gift Details =>
  // Currency => 

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
  const [treeCount, settreeCount] = useState(treeSelectionOptions[2].treeCount);
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


  React.useEffect(() => {
    if (router.query.project) {
      async function loadPaymentSetup() {
        try {
          const paymentSetupData = await getRequest(
            `/app/projects/${router.query.project}/paymentOptions`
          );          
          if (paymentSetupData.data) {
            setpaymentSetup(paymentSetupData.data);
          }
        } catch (err) {
          // console.log(err);
        }
      }
      loadPaymentSetup();
    }
  }, [router.query]);

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
        currency
      }}
    >
      {children}
    </QueryParamContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(QueryParamContext);
}
