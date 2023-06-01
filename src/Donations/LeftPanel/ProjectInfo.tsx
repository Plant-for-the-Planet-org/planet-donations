import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { FetchedProjectDetails } from "src/Common/Types";
import styles from "./LeftPanel.module.scss";

interface Props {
  projectDetails: FetchedProjectDetails;
}

const ProjectInfo = ({ projectDetails }: Props): ReactElement => {
  const { t } = useTranslation("common");

  const { purpose, description, ownerName } = projectDetails;
  const canShowDescription =
    (purpose === "funds" || purpose === "bouquet") && description !== null;
  const canShowOwner =
    (purpose === "trees" || purpose === "conservation") && ownerName !== null;

  return (
    <>
      {canShowDescription && (
        <p className={styles["project-description"]}>{description}</p>
      )}
      {canShowOwner && (
        <div>
          {t("byOrganization", {
            organizationName: ownerName,
          })}
        </div>
      )}
    </>
  );
};

export default ProjectInfo;
