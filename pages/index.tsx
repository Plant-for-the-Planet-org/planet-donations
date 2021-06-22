import React, { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Donations from './../src/Donations';
import nextI18NextConfig from '../next-i18next.config.js'
interface Props {}

function index({}: Props): ReactElement {
  return (
    <div style={{flexGrow:1}} className="d-flex justify-content-center align-items-center">
      <Donations/>
    </div>
  );
}

export default index;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "country"], nextI18NextConfig)),
  },
});
