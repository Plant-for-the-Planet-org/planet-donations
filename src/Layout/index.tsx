import React, { ReactElement } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { QueryParamContext } from "./QueryParamContext";

function Layout(props: any): ReactElement {
  const { paymentSetup } = React.useContext(QueryParamContext);
  return (
    <div>
      {paymentSetup?.gateways?.stripe?.isLive === false ? (
        <div className={"test-donation-bar"}>
          Test Mode: Your donations will not be charged
        </div>
      ) : null}
      <Header />
      {props.children}
      <Footer />
    </div>
  );
}

export default Layout;
