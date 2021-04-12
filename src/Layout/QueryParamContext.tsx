import { useRouter } from "next/dist/client/router";
import React, { Component } from "react";
import { getRequest } from "../Utils/api";

export const QueryParamContext = React.createContext({});

export default function QueryParamProvider({ children }: any) {
  const router = useRouter();

  const [paymentSetup, setpaymentSetup] = React.useState<null | Object>(null);

  React.useEffect(() => {
    if (router.query.project) {
      async function loadPaymentSetup() {
        try {
          const paymentSetupData = await getRequest(
            `/app/projects/${router.query.project}/paymentOptions`
          );
          if (paymentSetupData) {
            setpaymentSetup(paymentSetupData);
          }
        } catch (err) {
          // console.log(err);
        }
      }
      loadPaymentSetup();
    }
  }, [router.query]);

  console.log("paymentSetup", paymentSetup);

  return (
    <QueryParamContext.Provider value={{}}>
      {children}
    </QueryParamContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(QueryParamContext);
}
