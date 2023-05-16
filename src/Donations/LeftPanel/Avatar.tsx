import { ReactElement } from "react";
import {
  FetchedProjectDetails,
  PlanetCashSignupDetails,
} from "src/Common/Types";
import getImageUrl from "src/Utils/getImageURL";
import styles from "./LeftPanel.module.scss";

interface Props {
  projectDetails: FetchedProjectDetails | PlanetCashSignupDetails;
}

const Avatar = ({ projectDetails }: Props): ReactElement => {
  const renderAvatarImage = (
    ownerName: string | null,
    ownerAvatar: string | null
  ) => {
    return ownerAvatar ? (
      <img
        className={styles.avatar}
        src={getImageUrl("profile", "thumb", ownerAvatar)}
      />
    ) : (
      <div className={`${styles.avatar} ${styles["avatar--text"]}`}>
        {ownerName ? ownerName.charAt(0) : ""}
      </div>
    );
  };

  return projectDetails.purpose === "trees" ? (
    <a
      rel="noreferrer"
      target="_blank"
      href={`https://www.trilliontreecampaign.org/${projectDetails.id}`}
      className={styles["avatar-link"]}
    >
      {renderAvatarImage(projectDetails.ownerName, projectDetails.ownerAvatar)}
    </a>
  ) : (
    renderAvatarImage(projectDetails.ownerName, projectDetails.ownerAvatar)
  );
};

export default Avatar;
