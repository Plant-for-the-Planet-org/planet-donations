import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { SentGift } from "src/Common/Types";
import styles from "./LeftPanel.module.scss";

interface Props {
  giftDetails: SentGift;
}

const GiftInfo = ({ giftDetails }: Props): ReactElement => {
  const { t } = useTranslation("common");

  return (
    <div className={styles["gift-info"]}>
      <p>{t("dedicatedTo")}</p>
      {giftDetails.type === "direct" && giftDetails.recipientTreecounter ? (
        <a
          rel="noreferrer"
          target="_blank"
          href={`https://www.trilliontreecampaign.org/t/${giftDetails.recipientTreecounter}`}
          className={styles["gift-recipient"]}
        >
          {giftDetails.recipientName}
        </a>
      ) : (
        <p className={styles["gift-recipient"]}>{giftDetails.recipientName}</p>
      )}

      {giftDetails.message && (
        <p>
          {t("message")}: {giftDetails.message}
        </p>
      )}
    </div>
  );
};

export default GiftInfo;
