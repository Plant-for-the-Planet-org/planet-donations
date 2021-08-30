import React, { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

interface Props {}

function Custom404({}: Props): ReactElement {
  const router = useRouter();
  if (typeof window !== "undefined") {
    router.push("/");
  }
  return <div>Loading...</div>;
}

export default Custom404;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "country", "donate"])),
  },
});
