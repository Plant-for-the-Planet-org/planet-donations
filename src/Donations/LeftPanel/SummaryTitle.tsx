import { ReactElement } from "react";
import {
  FetchedProjectDetails,
  PlanetCashSignupDetails,
} from "src/Common/Types";
import VerifiedBadge from "./VerifiedBadge";
import styles from "./LeftPanel.module.scss";

interface Props {
  info: FetchedProjectDetails | PlanetCashSignupDetails;
}

const ProjectTitle = ({ info }: Props): ReactElement => {
  const isLinked = info.purpose === "trees" || info.purpose === "conservation";

  return (
    <h1 className={`${styles["project-title"]} title-text`}>
      {isLinked ? (
        <a
          rel="noreferrer"
          target="_blank"
          href={`https://www.trilliontreecampaign.org/${info.id}`}
        >
          {info.name + "    "}
        </a>
      ) : (
        <>{info.name + "    "}</>
      )}
      {info.purpose !== "planet-cash-signup" &&
        info.name !== null &&
        info.isApproved && <VerifiedBadge />}
    </h1>
  );
};

export default ProjectTitle;
