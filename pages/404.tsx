import React, { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { GetStaticProps } from "next/types";

function Custom404(): ReactElement {
  const router = useRouter();
  if (typeof window !== "undefined") {
    router.push("/");
  }
  return <div>Loading...</div>;
}

export default Custom404;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || "en", [
      "common",
      "country",
      "donate",
    ])),
  },
});
