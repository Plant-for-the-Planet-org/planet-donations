import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import InfoIcon from "public/assets/icons/InfoIcon";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import {
  usePopupState,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";

const DonationInfoTooltip = (): ReactElement => {
  const { t } = useTranslation("common");

  const infoPopupState = usePopupState({
    variant: "popover",
    popupId: "donationInfoPopover",
  });

  return (
    <>
      <span className="donation-info-tooltip" {...bindHover(infoPopupState)}>
        <InfoIcon />
      </span>
      <HoverPopover
        {...bindPopover(infoPopupState)}
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
        className="popup"
      >
        <div className="popup-content">{t("donationBreakdownInfo")}</div>
      </HoverPopover>
    </>
  );
};

export default DonationInfoTooltip;
