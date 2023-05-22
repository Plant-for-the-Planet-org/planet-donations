import { ReactElement } from "react";
import { Trans, useTranslation } from "next-i18next";
import styles from "./LeftPanel.module.scss";
import TopProjectIcon from "public/assets/icons/TopProjectIcon";
import { Typography } from "@mui/material";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import {
  usePopupState,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";

const TopProjectBadge = (): ReactElement => {
  const { t } = useTranslation("common");
  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });
  return (
    <>
      <div className={styles["top-project-badge"]} {...bindHover(popupState)}>
        <div className={styles["top-project-icon"]}>
          <TopProjectIcon />
        </div>
        <div>{t("topProject")}</div>
      </div>
      <HoverPopover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles["verified-badge-popup"]}
      >
        <Typography style={{ margin: 10, width: 300 }}>
          <Trans i18nKey="common:top_project_standards_fulfilled">
            The project inspection revealed that this project fulfilled at least
            12 of the 19 Top Project{" "}
            <a
              target="_blank"
              href={t("standardsLink")}
              rel="noreferrer"
              style={{ color: "#68B030", fontWeight: 400, display: "inline" }}
              onClick={(e) => e.stopPropagation()}
            >
              standards.
            </a>
          </Trans>
        </Typography>
      </HoverPopover>
    </>
  );
};

export default TopProjectBadge;
