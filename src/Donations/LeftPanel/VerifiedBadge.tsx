import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import VerifiedIcon from "@mui/icons-material/Verified";
import styles from "./LeftPanel.module.scss";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import {
  usePopupState,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";

const VerifiedBadge = (): ReactElement => {
  const { t } = useTranslation("common");

  const verifiedPopupState = usePopupState({
    variant: "popover",
    popupId: "verifiedPopover",
  });

  return (
    <>
      <span className={styles["verified-badge"]}>
        <VerifiedIcon
          sx={{ width: "100%" }}
          {...bindHover(verifiedPopupState)}
        />
      </span>
      <HoverPopover
        {...bindPopover(verifiedPopupState)}
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
        <div className={styles["verified-popup-container"]}>
          {" "}
          {t("verifiedIconInfo")}
        </div>
      </HoverPopover>
    </>
  );
};

export default VerifiedBadge;
