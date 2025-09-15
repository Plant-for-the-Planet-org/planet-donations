import React, { ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "src/Layout/QueryParamContext";

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

  const parsedCallbackUrl = useMemo(() => {
    try {
      return new URL(callbackUrl);
    } catch {
      return null;
    }
  }, [callbackUrl]);

  const domain = useMemo(
    () => (parsedCallbackUrl ? parsedCallbackUrl.hostname : ""),
    [parsedCallbackUrl]
  );

  const shouldShowButton = useMemo(
    () =>
      !!parsedCallbackUrl &&
      (parsedCallbackUrl.protocol === "https:" ||
        parsedCallbackUrl.protocol === "http:") &&
      domain !== "",
    [parsedCallbackUrl, domain]
  );

  React.useEffect(() => {
    if (callbackMethod === "api" && shouldShowButton) {
      router.push(
        `${callbackUrl}?context=${donationContext}&don_status=${donationStatus}`
      );
    }
  }, [callbackMethod, shouldShowButton]);

  const sendToReturn = () => {
    if (callbackMethod === "api") {
      router.push(
        `${callbackUrl}?context=${donationContext}&don_status=${donationStatus}`
      );
    } else {
      router.push(`${callbackUrl}`);
    }
  };

  // Don't render button if no valid return destination
  if (!shouldShowButton) {
    return <></>;
  }

  return (
    <>
      <button
        onClick={() => sendToReturn()}
        className="primary-button"
        style={{ marginBottom: 20 }}
      >
        {t("common:returnTo", { domain })}
      </button>
    </>
  );
}
