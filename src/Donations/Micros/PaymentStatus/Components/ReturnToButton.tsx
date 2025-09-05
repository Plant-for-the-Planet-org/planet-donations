import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { getHostnameFromUrl } from "src/Utils/getHostnameFromUrl";

interface Props {
  donationContext: string;
  donationStatus: string;
}

export default function ReturnToButton({
  donationContext,
  donationStatus,
}: Props): ReactElement {
  const { callbackUrl, callbackMethod } = React.useContext(QueryParamContext);
  const router = useRouter();
  const { t } = useTranslation("common");

  React.useEffect(() => {
    if (callbackMethod === "api") {
      router.push(
        `${callbackUrl}?context=${donationContext}&don_status=${donationStatus}`
      );
    }
  }, [callbackMethod]);

  const displayedReturnDomain = getHostnameFromUrl(callbackUrl);

  const sendToReturn = () => {
    if (callbackMethod === "api") {
      router.push(
        `${callbackUrl}?context=${donationContext}&don_status=${donationStatus}`
      );
    } else {
      router.push(`${callbackUrl}`);
    }
  };

  return (
    <>
      <button
        onClick={() => sendToReturn()}
        className="primary-button"
        style={{ marginBottom: 20 }}
      >
        {t("common:returnTo")} {displayedReturnDomain}
      </button>
    </>
  );
}
