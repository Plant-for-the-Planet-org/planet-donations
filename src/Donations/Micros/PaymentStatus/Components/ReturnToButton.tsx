import { ReactElement, useMemo, useEffect, useContext } from "react";
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
  const { callbackUrl, callbackMethod } = useContext(QueryParamContext);
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

  useEffect(() => {
    if (callbackMethod === "api" && shouldShowButton && parsedCallbackUrl) {
      const url = new URL(parsedCallbackUrl);
      url.searchParams.set("context", donationContext);
      url.searchParams.set("don_status", donationStatus);
      router.push(url.toString());
    }
  }, [callbackMethod, shouldShowButton]);

  const sendToReturn = () => {
    if (callbackMethod === "api" && parsedCallbackUrl) {
      const url = new URL(parsedCallbackUrl);
      url.searchParams.set("context", donationContext);
      url.searchParams.set("don_status", donationStatus);
      router.push(url.toString());
    } else {
      router.push(`${callbackUrl}`);
    }
  };

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
