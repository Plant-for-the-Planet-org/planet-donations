import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Typography } from "@mui/material";
import styles from "./LeftPanel.module.scss";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import {
  usePopupState,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";

const VerifiedBadge = (): ReactElement => {
  const { t } = useTranslation("common");

  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  return (
    <>
      <VerifiedIcon
        className={styles["verified-badge"]}
        {...bindHover(popupState)}
      />
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
          {" "}
          {t("verifiedIconInfo")}
        </Typography>
      </HoverPopover>
    </>
  );
};

export default VerifiedBadge;
