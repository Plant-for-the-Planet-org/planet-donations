import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import AuthInterstitial from "src/Common/AuthInterstitial";

const AuthRedirect = (): ReactElement | null => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== undefined) {
      const redirectPath = localStorage.getItem("redirectPath");
      if (redirectPath) {
        router.push(redirectPath);
        localStorage.removeItem("redirectPath");
      } else {
        router.push("/");
      }
    }
  }, []);

  return <AuthInterstitial />;
};

export default AuthRedirect;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", [
        "common",
        "country",
        "donate",
      ])),
    },
  };
};
