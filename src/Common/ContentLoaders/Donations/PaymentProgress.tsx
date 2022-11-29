import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import styles from "./PaymentProgress.module.scss";

interface PaymentProgressProps {
  isPaymentProcessing: boolean;
}

export default function PaymentProgress({
  isPaymentProcessing,
}: PaymentProgressProps): ReactElement | null {
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
