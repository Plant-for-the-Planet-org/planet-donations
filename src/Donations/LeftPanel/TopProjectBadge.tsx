import { ReactElement } from "react";
import styles from "./LeftPanel.module.scss";

const TopProjectBadge = (): ReactElement => {
  return <div className={styles["top-project-badge"]}>Top Project</div>;
};

export default TopProjectBadge;
