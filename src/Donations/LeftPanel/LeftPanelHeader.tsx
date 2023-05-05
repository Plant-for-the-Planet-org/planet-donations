import { FC } from "react";
import styles from "./LeftPanel.module.scss";

const LeftPanelHeader: FC = ({ children }) => {
  return <div className={styles["left-panel-header"]}>{children}</div>;
};

export default LeftPanelHeader;
