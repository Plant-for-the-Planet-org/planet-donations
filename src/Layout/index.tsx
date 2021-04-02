import React, { ReactElement } from "react";
import Footer from "./Footer";
import Header from "./Header";

function Layout(props: any): ReactElement {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
}

export default Layout;
