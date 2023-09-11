import { ReactElement } from "react";
import {
  FetchedProjectDetails,
  PlanetCashSignupDetails,
} from "src/Common/Types";
import getImageUrl from "src/Utils/getImageURL";
import styles from "./LeftPanel.module.scss";
interface Props {
  info: FetchedProjectDetails | PlanetCashSignupDetails;
}

const Avatar = ({ info }: Props): ReactElement => {
  const { ownerName, ownerAvatar } = info;

  const renderAvatarImage = (
    ownerName: string | null,
    ownerAvatar: string | null,
  ): JSX.Element => {
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

  return info.purpose === "trees" ? (
    <a
      rel="noreferrer"
      target="_blank"
      href={`https://www.trilliontreecampaign.org/${info.id}`}
      className={styles["avatar-link"]}
    >
      {renderAvatarImage(ownerName, ownerAvatar)}
    </a>
  ) : (
    renderAvatarImage(ownerName, ownerAvatar)
  );
};

export default Avatar;
