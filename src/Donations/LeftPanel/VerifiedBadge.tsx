import { ReactElement, useState, MouseEvent } from "react";
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

interface Props {
  isMobile: boolean;
}

const VerifiedBadge = ({ isMobile }: Props): ReactElement => {
  const { t } = useTranslation("common");

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const isPopoverOpen = anchorElement !== null;

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  return (
    <>
      <div
        aria-owns={isPopoverOpen ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={styles["verified-badge"]}
      >
        <VerifiedIcon sx={{ color: "#fff" }} {...bindHover(popupState)} />
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
      >
        <Typography style={{ margin: 10, width: 300 }}>
          {t("verifiedIconInfo")}
        </Typography>
      </HoverPopover>
    </>
  );
};

export default VerifiedBadge;
