import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";
// import tenantConfig from '../../../../tenant.config';
import { useTranslation } from "react-i18next";
import { getPaymentType } from "../PaymentFunctions";
import PaymentFailedIllustration from "../../../public/assets/icons/donation/PaymentFailed";
import PaymentPendingIllustration from "../../../public/assets/icons/donation/PaymentPending";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import { getFormattedNumber } from "../../Utils/getFormattedNumber";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import ShareOptions from "../Micros/ShareOptions";
import CloseIcon from "../../../public/assets/icons/CloseIcon";
import { getRequest } from "../../Utils/api";
import { QueryParamContext } from "../../Layout/QueryParamContext";

function ThankYou() {
  const { t, i18n, ready } = useTranslation(["common", "country"]);

  const {
    donationID,
    paymentType,
    setdonationStep,
    redirectstatus,
  } = React.useContext(QueryParamContext);

  const [donation, setdonation] = React.useState(null);

  async function loadDonation() {
    const donation = await getRequest(`/app/donations/${donationID}`);
    setdonation(donation);
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

  let currencyFormat = () => {};
  if (donation) {
    currencyFormat = () =>
      getFormatedCurrency(i18n.language, donation.currency, donation.amount);
  }

  function SuccessfulDonation() {
    return (
      <div className={"cardContainer"}>
        <div className={"contributionMessageContainer"}>
          <div className={"contributionMessage"} style={{ marginTop: "0px" }}>
            {t(
              paymentTypeUsed === "GOOGLE_PAY" ||
                paymentTypeUsed === "APPLE_PAY"
                ? "donate:donationSuccessfulWith"
                : "donate:donationSuccessful",
              {
                totalAmount: currencyFormat(),
                paymentTypeUsed,
              }
            )}
            {donation.gift
              ? " " +
                t("donate:giftSentMessage", {
                  recipientName: donation.gift.recipientName,
                })
              : null}
            {" " +
              t("donate:yourTreesPlantedByOnLocation", {
                treeCount: getFormattedNumber(
                  i18n.language,
                  Number(donation.treeCount)
                ),
                projectName: donation.project.name,
                location: t(
                  "country:" + donation.project.country.toLowerCase()
                ),
              })}
          </div>

          <div className={"contributionMessage"}>
            {t("donate:contributionMessage")}
          </div>
        </div>

        {/* <div className={'horizontalLine} /> */}

        {/* hidden div for image download */}
        <div style={{ width: "0px", height: "0px", overflow: "hidden" }}>
          <div className={"tempThankYouImage"} ref={imageRef}>
            <div className={"tempthankyouImageHeader"}>
              <p
                dangerouslySetInnerHTML={{
                  __html: t("donate:thankyouHeaderText"),
                }}
              />
            </div>
            <p className={"tempDonationCount"}>
              {t("donate:myTreesPlantedByOnLocation", {
                treeCount: getFormattedNumber(
                  i18n.language,
                  Number(donation.treeCount)
                ),
                location: t(
                  "country:" + donation.project.country.toLowerCase()
                ),
              })}
            </p>
            <p className={"tempDonationTenant"}>
              {/* {t('donate:plantTreesAtURL', { url: config.tenantURL })} */}
            </p>
          </div>
        </div>

        <div className={"treeDonationContainer"}>
          <div className={"thankyouImageContainer"}>
            <div className={"thankyouImage"}>
              <div className={"thankyouImageHeader"}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("donate:thankyouHeaderText"),
                  }}
                />
              </div>
              <div className={"donationCount"}>
                {t("donate:myTreesPlantedByOnLocation", {
                  treeCount: getFormattedNumber(
                    i18n.language,
                    Number(donation.treeCount)
                  ),
                  location: t(
                    "country:" + donation.project.country.toLowerCase()
                  ),
                })}
                <p className={"donationTenant"}>
                  {/* {t('donate:plantTreesAtURL', { url: config.tenantURL })} */}
                </p>
              </div>
            </div>
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
      <div className={"cardContainer"} style={{ paddingBottom: "24px" }}>
        <div className={"contributionMessageContainer"}>
          <div className={"contributionMessage"} style={{ margin: "0px" }}>
            {t("donate:donationFailedMessage")}
          </div>
        </div>
        <div className={"treeDonationContainer"}>
          <PaymentFailedIllustration />
        </div>
      </div>
    );
  }

  const titleMessage = "";

  function PendingDonation() {
    return (
      <div>
        <div className={"contributionMessageContainer"}>
          <div className={"contributionMessage"}>
            {t("donate:donationPendingMessage")}
          </div>
          <div
            className={"contributionMessage"}
            style={{ marginBottom: "24px", fontStyle: "italic" }}
          >
            {t("donate:donationRef")} {donationID}
          </div>
        </div>
        <div className={"treeDonationContainer"}>
          <PaymentPendingIllustration />
        </div>
      </div>
    );
  }

  return !ready && !donation ? (
    <PaymentProgress isPaymentProcessing={true} />
  ) : (
    <div className="donations-forms-container">
      <div className="donations-form">
        <div className={"header-title-container"}>
          <button
            id={"thank-you-close"}
            //onClick={onClose}
            className={"headerCloseIcon"}
          >
            <CloseIcon />
          </button>
          <div className={"header-title"}>{t("thankYou")}</div>
        </div>

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

        {donation.paymentStatus ? (
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

      {/* snackbar for showing text copied to clipboard */}
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
  );
}

export default ThankYou;
