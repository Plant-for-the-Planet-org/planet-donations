import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { GiftDetails } from "src/Common/Types";
import styles from "./LeftPanel.module.scss";

interface Props {
  giftDetails: GiftDetails;
}

const GiftInfo = ({ giftDetails }: Props): ReactElement => {
  const { t } = useTranslation("common");

  return (
    <div className={styles["gift-info"]}>
      <p>{t("dedicatedTo")}</p>
      {giftDetails.type === "direct" && giftDetails.recipientProfile ? (
        <a
          rel="noreferrer"
          target="_blank"
          href={`https://web.plant-for-the-planet.org/t/${giftDetails.recipientProfile}`}
          className={styles["gift-recipient"]}
        >
          {giftDetails.recipientName}
        </a>
      ) : (
        <p className={styles["gift-recipient"]}>{giftDetails.recipientName}</p>
      )}

      {giftDetails.type === "invitation" && giftDetails.message && (
        <p>
          {t("message")}: {giftDetails.message}
        </p>
      )}
    </div>
  );
};

export default GiftInfo;
