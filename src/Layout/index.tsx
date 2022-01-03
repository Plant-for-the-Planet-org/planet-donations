import React, { ReactElement } from "react";
import { ThemeContext } from "../../styles/themeContext";
import Footer from "./Footer";
import Header from "./Header";
import { QueryParamContext } from "./QueryParamContext";

function Layout(props: any): ReactElement {
  const { paymentSetup, embed } = React.useContext(QueryParamContext);
  const { theme } = React.useContext(ThemeContext);
  return (
    <div className={`page-container ${theme}`}>
      {paymentSetup?.gateways?.stripe?.isLive === false ? (
        <div className={"test-donation-bar"}>
          Test Mode: Your donations will not be charged
        </div>
      ) : null}
      <Header />
      {props.children}
      {!embed ? <Footer /> : []}
    </div>
  );
}

export default Layout;
