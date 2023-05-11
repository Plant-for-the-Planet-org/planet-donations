import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import styles from "./LeftPanel.module.scss";

const TopProjectBadge = (): ReactElement => {
  const { t } = useTranslation("common");
  return <div className={styles["top-project-badge"]}>{t("topProject")}</div>;
};

export default TopProjectBadge;
