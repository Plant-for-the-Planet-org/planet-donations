import { FC } from "react";
import {
  FetchedProjectDetails,
  PlanetCashSignupDetails,
} from "../../Common/Types";
import { getTenantBackground } from "../../Utils/getTenantBackground";
import styles from "./LeftPanel.module.scss";

interface Props {
  info?: FetchedProjectDetails | PlanetCashSignupDetails | null;
  donationStep?: number | null;
  tenant: string;
}

const LeftPanelContainer: FC<Props> = ({
  info = null,
  donationStep,
  tenant,
  children,
}) => {
  const getBackgroundImage = () => {
    if (info || donationStep === 0) {
      return `url(${getTenantBackground(tenant, info)})`;
    }
    return "none";
  };

  return (
    <div
      style={{
        backgroundImage: getBackgroundImage(),
      }}
      className={styles["left-panel-container"]}
    >
      <div className={styles["background-overlay"]}></div>
      {children}
    </div>
  );
};

export default LeftPanelContainer;
