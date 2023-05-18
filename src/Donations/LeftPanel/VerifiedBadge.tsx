import { ReactElement, useState, MouseEvent } from "react";
import { useTranslation } from "next-i18next";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Typography, Popover } from "@mui/material";
import styles from "./LeftPanel.module.scss";

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

  return (
    <>
      <div
        aria-owns={isPopoverOpen ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={styles["verified-badge"]}
      >
        <VerifiedIcon sx={{ color: "#fff" }} />
      </div>
      <Popover
        id="mouse-over-popover"
        className={styles["verified-badge-popup"]}
        open={isPopoverOpen}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isMobile ? "center" : "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        marginThreshold={0}
      >
        <Typography>{t("verifiedIconInfo")}</Typography>
      </Popover>
    </>
  );
};

export default VerifiedBadge;
