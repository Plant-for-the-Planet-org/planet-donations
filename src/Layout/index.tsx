import React, { FC } from "react";
import { ThemeContext } from "../../styles/themeContext";
import Footer from "./Footer";
import Header from "./Header";

const Layout: FC = ({ children }) => {
  /* const { paymentSetup } = React.useContext(QueryParamContext); */
  const { theme } = React.useContext(ThemeContext);
  return (
    <div className={`page-container ${theme}`}>
      {/* TODOO - Remove commented code below after confirmation */}
      {/* {!paymentSetup?.gateways?.stripe?.isLive === false ? (
        <div className={"test-donation-bar"}>
          Test Mode: Your donations will not be charged
        </div>
      ) : null} */}
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
