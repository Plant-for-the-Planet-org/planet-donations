import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";
import { useTranslation } from "next-i18next";
import PaymentProgress from "../../Common/ContentLoaders/Donations/PaymentProgress";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import { apiRequest } from "../../Utils/api";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import FailedDonation from "../Micros/PaymentStatus/FailedDonation";
import SuccessfulDonation from "../Micros/PaymentStatus/SuccessfulDonation";
import PendingDonation from "../Micros/PaymentStatus/PendingDonation";
import { useRouter } from "next/router";
import SuccessfulDonationJane from "../Micros/PaymentStatus/Tenants/SuccessfulDonationJane";
import TransferDetails from "../Micros/PaymentStatus/TransferDetails";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./PaymentStatus.module.scss";
import PlanetCashSignup from "../Micros/PlanetCashSignup";
import { APIError, handleError } from "@planet-sdk/common";
import { Donation } from "src/Common/Types/donation";

function ThankYou() {
  const { t, i18n, ready } = useTranslation(["common", "country", "donate"]);

  const {
    donationID,
    redirectstatus,
    setshowErrorCard,
    tenant,
    transferDetails,
    donation,
    setdonation,
    setTransferDetails,
    setErrors,
  } = React.useContext(QueryParamContext);

  async function loadDonation() {
    try {
      const requestParams = {
        url: `/app/donations/${donationID}`,
        setshowErrorCard,
        tenant,
      };
      const donation = await apiRequest(requestParams);
      if (donation.status === 200) {
        setdonation(donation.data as Donation); //TODOO - remove annotation by specifying type returned by apiRequest
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
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
        donation.gateway !== "offline" &&
        (donation.paymentStatus === "pending" ||
          donation.paymentStatus === "initiated")
      ) {
        loadDonation();
      }
    }, 12000);
    return () => {
      clearInterval(interval);
    };
  }, [donation]);

  React.useEffect(() => {
    if (donation) {
      if (donation.account) {
        setTransferDetails(donation.account);
      }
    }
  }, [donation]);

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] =
    React.useState(false);

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

  const { callbackUrl, paymentError, projectDetails } =
    React.useContext(QueryParamContext);

  const router = useRouter();

  const sendToReturn = () => {
    router.push(callbackUrl);
  };

  const status = redirectstatus || donation?.paymentStatus;

  const SuccessComponent = () => {
    switch (tenant) {
      case "ten_1e5WejOp":
        return (
          <SuccessfulDonationJane
            donation={donation as Donation}
            sendToReturn={sendToReturn}
          />
        );
      default:
        return (
          <SuccessfulDonation
            donation={donation as Donation}
            sendToReturn={sendToReturn}
          />
        );
    }
  };

  return (
    <div className="donations-forms-container" style={{ paddingBottom: "0px" }}>
      {projectDetails?.purpose === "planet-cash-signup" ? (
        <PlanetCashSignup />
      ) : (
        <div className="donations-form w-100">
          {!ready && !donation ? (
            <PaymentProgress isPaymentProcessing={true} />
          ) : (
            <div>
              {donation && donation.paymentStatus ? (
                status === "success" ||
                status === "paid" ||
                status === "succeeded" ? (
                  <SuccessComponent />
                ) : status === "failed" || paymentError ? (
                  <FailedDonation
                    sendToReturn={sendToReturn}
                    donation={donation}
                  />
                ) : transferDetails ? (
                  <TransferDetails
                    donationID={donationID as string}
                    donation={donation}
                    sendToReturn={sendToReturn}
                  />
                ) : (
                  <PendingDonation
                    donationID={donationID}
                    sendToReturn={sendToReturn}
                  />
                )
              ) : (
                <div className={styles.loaderContainer}>
                  <CircularProgress color="inherit" />
                </div>
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
      )}
    </div>
  );
}

export default ThankYou;
