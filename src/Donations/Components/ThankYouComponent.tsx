import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";
// import tenantConfig from '../../../../tenant.config';
import { useTranslation } from "react-i18next";
import { getPaymentType } from "../PaymentMethods/PaymentFunctions";
import PaymentFailedIllustration from "../../../public/assets/icons/donation/PaymentFailed";
import PaymentPendingIllustration from "../../../public/assets/icons/donation/PaymentPending";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import { getFormattedNumber } from "../../Utils/getFormattedNumber";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import ShareOptions from "../Micros/ShareOptions";
import CloseIcon from "../../../public/assets/icons/CloseIcon";
import { getRequest } from "../../Utils/api";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import themeProperties from "../../../styles/themeProperties";
import { useRouter } from "next/dist/client/router";

function ThankYou() {
  const { t, i18n, ready } = useTranslation(["common", "country"]);

  const {
    donationID,
    paymentType,
    setdonationStep,
    redirectstatus,
    returnTo,
  } = React.useContext(QueryParamContext);

  const [donation, setdonation] = React.useState(null);

  const router = useRouter();

  async function loadDonation() {
    const donation = await getRequest(`/app/donations/${donationID}`);
    if (donation.status === 200) {
      setdonation(donation.data);
    }
  }

  React.useEffect(() => {
    if (donationID) {
      loadDonation();
    }
  }, [donationID]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (
        donation &&
        (donation.paymentStatus === "pending" ||
          donation.paymentStatus === "initiated")
      ) {
        loadDonation();
      }
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [donation]);

  //   const config = tenantConfig();
  const imageRef = React.createRef();

  const paymentTypeUsed = getPaymentType(paymentType);

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] = React.useState(
    false
  );

  const sendRef = () => imageRef;

  const handleTextCopiedSnackbarOpen = () => {
    setTextCopiedSnackbarOpen(true);
  };
  const handleTextCopiedSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setTextCopiedSnackbarOpen(false);
  };

  const sendToReturn = () => {
    router.push(returnTo);
  };

  let currencyFormat = () => {};
  if (donation) {
    currencyFormat = () =>
      getFormatedCurrency(i18n.language, donation.currency, donation.amount);
  }

  function SuccessfulDonation() {
    return (
      <div className="d-flex column justify-content-center">
        {returnTo ? (
          <button
            id={"thank-you-close"}
            onClick={() => sendToReturn()}
            className="mb-10"
            style={{ alignSelf: "flex-start" }}
          >
            <CloseIcon color={themeProperties.light.primaryFontColor} />
          </button>
        ) : (
          <></>
        )}

        <div className={"title-text"}>{t("common:thankYou")}</div>

        <div className={"mt-20 text-center"}>
          {t(
            paymentTypeUsed === "GOOGLE_PAY" || paymentTypeUsed === "APPLE_PAY"
              ? "common:donationSuccessfulWith"
              : "common:donationSuccessful",
            {
              totalAmount: currencyFormat(),
              paymentTypeUsed,
            }
          )}
          {donation.gift
            ? " " +
              t("common:giftSentMessage", {
                recipientName: donation.gift.recipientName,
              })
            : null}
          {" " +
            t("common:yourTreesPlantedByOnLocation", {
              treeCount: getFormattedNumber(
                i18n.language,
                Number(donation.treeCount)
              ),
              projectName: donation.project.name,
              location: t("country:" + donation.project.country.toLowerCase()),
            })}
        </div>

        <div className={"mt-20 text-center"}>
          {t("common:contributionMessage")}
        </div>

        {/* <div className={'horizontalLine} /> */}

        {/* hidden div for image download */}
        <div
          className="temp-image"
          style={{ width: "0px", height: "0px", overflow: "hidden" }}
        >
          <div className={"thankyou-image"} ref={imageRef}>
            <div className={"thankyou-image-header"}>
              <p
                dangerouslySetInnerHTML={{
                  __html: t("common:thankyouHeaderText"),
                }}
              />
            </div>
            <p className={"donation-count"}>
              {t("common:myTreesPlantedByOnLocation", {
                treeCount: getFormattedNumber(
                  i18n.language,
                  Number(donation.treeCount)
                ),
                location: t(
                  "country:" + donation.project.country.toLowerCase()
                ),
              })}
            </p>
            <p className={"donation-url"}>
              {t("common:plantTreesAtURL", {
                url: "www.plant-for-the-planet.org",
              })}
            </p>
          </div>
        </div>

        <div className={"thankyou-image"}>
          <p
            className={"thankyou-image-header"}
            dangerouslySetInnerHTML={{
              __html: t("common:thankyouHeaderText"),
            }}
          />
          <div className={"donation-count"}>
            {t("common:myTreesPlantedByOnLocation", {
              treeCount: getFormattedNumber(
                i18n.language,
                Number(donation.treeCount)
              ),
              location: t("country:" + donation.project.country.toLowerCase()),
            })}
            <p className={"donation-url"}>
              {t("common:plantTreesAtURL", {
                url: "www.plant-for-the-planet.org",
              })}
            </p>
          </div>
        </div>

        <ShareOptions
          treeCount={getFormattedNumber(
            i18n.language,
            Number(donation.treeCount)
          )}
          sendRef={sendRef}
          handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
          donor={donation.donor}
        />
      </div>
    );
  }

  function FailedDonation() {
    return (
      <div>
        <button
          id={"thank-you-close"}
          onClick={() => sendToReturn()}
          className="mb-10"
          style={{ alignSelf: "flex-start" }}
        >
          <CloseIcon color={themeProperties.light.primaryFontColor} />
        </button>
        <div className={"title-text"}>{t("common:donationFailed")}</div>
        <div className={"mt-20 text-center"}>
          {t("common:donationFailedMessage")}
        </div>
        <PaymentFailedIllustration />
      </div>
    );
  }

  function PendingDonation() {
    return (
      <div>
        <button
          id={"thank-you-close"}
          onClick={() => sendToReturn()}
          className="mb-10"
          style={{ alignSelf: "flex-start" }}
        >
          <CloseIcon color={themeProperties.light.primaryFontColor} />
        </button>
        <div className={"title-text"}>{t("common:donationPending")}</div>
        <div className={"mt-20 text-center"}>
          {t("common:donationPendingMessage")}
        </div>
        <div className={"mt-20 text-center"} style={{ fontStyle: "italic" }}>
          {t("common:donationRef")} {donationID}
        </div>
        <PaymentPendingIllustration />
      </div>
    );
  }

  return (
    <div className="donations-forms-container">
      <div className="donations-form w-100">
        {!ready && !donation ? (
          <PaymentProgress isPaymentProcessing={true} />
        ) : (
          <div>
            {redirectstatus ? (
              redirectstatus === "succeeded" ? (
                <SuccessfulDonation />
              ) : redirectstatus === "failed" ? (
                <FailedDonation />
              ) : (
                <PendingDonation />
              )
            ) : (
              <></>
            )}

            {donation && donation.paymentStatus ? (
              donation.paymentStatus === "success" ||
              donation.paymentStatus === "paid" ? (
                <SuccessfulDonation />
              ) : donation.paymentStatus === "failed" ? (
                <FailedDonation />
              ) : (
                <PendingDonation />
              )
            ) : (
              <></>
            )}
          </div>
        )}

        <Snackbar
          open={textCopiedsnackbarOpen}
          autoHideDuration={4000}
          onClose={handleTextCopiedSnackbarClose}
        >
          <Alert onClose={handleTextCopiedSnackbarClose} severity="success">
            {t("donate:copiedToClipboard")}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default ThankYou;
