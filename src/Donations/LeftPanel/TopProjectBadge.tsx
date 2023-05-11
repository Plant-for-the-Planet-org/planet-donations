import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import styles from "./LeftPanel.module.scss";
import TopProjectIcon from "public/assets/icons/TopProjectIcon";

const TopProjectBadge = (): ReactElement => {
  const { t } = useTranslation("common");
  return (
    <div className={styles["top-project-badge"]}>
      <div className={styles["top-project-icon"]}>
        <TopProjectIcon />
      </div>
      <div>{t("topProject")}</div>
    </div>
  );
};

export default TopProjectBadge;
