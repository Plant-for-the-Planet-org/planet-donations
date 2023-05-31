import { ReactElement } from "react";
import {
  FetchedProjectDetails,
  PlanetCashSignupDetails,
} from "src/Common/Types";
import VerifiedBadge from "./VerifiedBadge";
import styles from "./LeftPanel.module.scss";

interface Props {
  projectDetails: FetchedProjectDetails | PlanetCashSignupDetails;
  isMobile: boolean;
}

const ProjectTitle = ({ projectDetails, isMobile }: Props): ReactElement => {
  const isLinked =
    projectDetails.purpose === "trees" ||
    projectDetails.purpose === "conservation";

  return (
    <div className={`${styles["project-title"]} title-text`}>
      {isLinked ? (
        <a
          rel="noreferrer"
          target="_blank"
          href={`https://www.trilliontreecampaign.org/${projectDetails.id}`}
        >
          <h1>{projectDetails.name}</h1>
        </a>
      ) : (
        <h1>{projectDetails.name}</h1>
      )}
      {projectDetails.name !== null && projectDetails?.isApproved && (
        <VerifiedBadge isMobile={isMobile} />
      )}
    </div>
  );
};

export default ProjectTitle;
