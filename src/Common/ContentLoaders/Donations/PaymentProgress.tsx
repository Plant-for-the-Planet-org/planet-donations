import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "next-i18next";
import styles from "./PaymentProgress.module.scss";

export default function PaymentProgress(isPaymentProcessing: boolean) {
  const { t, ready } = useTranslation("common");

  return ready ? (
    <Backdrop className={styles.progressBackdrop} open={isPaymentProcessing}>
      <CircularProgress color="inherit" />
      <h2 className={styles.progressBackdropHeader}>
        {t("seedingYourDonation")}
      </h2>
      <h4 className={styles.progressBackdropText}>
        {t("pleaseDoNotCloseThisTab")}
      </h4>
    </Backdrop>
  ) : null;
}
