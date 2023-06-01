import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { OnBehalfDonor } from "src/Common/Types";
import styles from "./LeftPanel.module.scss";

interface Props {
  onBehalfDonor: OnBehalfDonor;
}

const OnBehalfInfo = ({ onBehalfDonor }: Props): ReactElement => {
  const { t } = useTranslation("common");

  return (
    <div className={styles["on-behalf-info"]}>
      <p>{t("onBehalfOf")}</p>
      <p className={styles["donor-name"]}>
        {onBehalfDonor.firstName + " " + onBehalfDonor.lastName}
      </p>
    </div>
  );
};

export default OnBehalfInfo;
