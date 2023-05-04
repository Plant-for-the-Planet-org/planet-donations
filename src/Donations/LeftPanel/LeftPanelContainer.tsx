import { FC } from "react";
import {
  FetchedProjectDetails,
  PlanetCashSignupDetails,
} from "../../Common/Types";
import { getTenantBackground } from "../../Utils/getTenantBackground";
import styles from "./LeftPanel.module.scss";

interface Props {
  projectDetails?: FetchedProjectDetails | PlanetCashSignupDetails | null;
  donationStep?: number | null;
  tenant: string;
}

const LeftPanelContainer: FC<Props> = ({
  projectDetails,
  donationStep,
  tenant,
  children,
}) => {
  const getBackgroundImage = () => {
    if (projectDetails || donationStep === 0) {
      return `url(${getTenantBackground(
        tenant,
        projectDetails as FetchedProjectDetails | null
      )})`;
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
