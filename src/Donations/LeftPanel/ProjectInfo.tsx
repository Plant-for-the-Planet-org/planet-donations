import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { FetchedProjectDetails } from "src/Common/Types";

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
      {canShowDescription && <p className="mt-10">{description}</p>}
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
