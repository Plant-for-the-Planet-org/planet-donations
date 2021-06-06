import React, { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Donations from './../src/Donations'
interface Props {}

function index({}: Props): ReactElement {
  return (
    <div style={{flexGrow:1}}>
      <Donations/>
    </div>
  );
}

export default index;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "country"])),
  },
});
