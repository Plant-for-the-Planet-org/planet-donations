import {
  ReactElement,
  useContext,
  useState,
  useEffect,
  MouseEvent,
} from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Typography, Popover } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import BackButton from "public/assets/icons/BackButton";
import LeftPanelContainer from "./LeftPanelContainer";
import getFormatedCurrency from "../../Utils/getFormattedCurrency";
import { getFormattedNumber } from "../../Utils/getFormattedNumber";
import getImageUrl from "../../Utils/getImageURL";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import LeftPanelHeader from "./LeftPanelHeader";

function LeftPanel(): ReactElement {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const {
    projectDetails,
    donationID,
    donationStep,
    quantity,
    paymentSetup,
    currency,
    contactDetails,
    giftDetails,
    isGift,
    tenant,
    frequency,
    onBehalf,
    onBehalfDonor,
    isPlanetCashActive,
    country,
    callbackUrl,
  } = useContext(QueryParamContext);

  const [isMobile, setIsMobile] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth > 767) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    }
  });

  const TPOImage = () => {
    return projectDetails?.ownerAvatar ? (
      <img
        className="project-organisation-image"
        src={getImageUrl("profile", "thumb", projectDetails.ownerAvatar)}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "48px",
          border: "1px solid #fff",
        }}
      />
    ) : (
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "48px",
          border: "1px solid #fff",
        }}
        className="project-organisation-image no-project-organisation-image mb-10"
      >
        {projectDetails?.ownerName?.charAt(0)}
      </div>
    );
  };

  const goBack = () => {
    router.push(`${callbackUrl ? callbackUrl : "/"}`);
  };

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  const open = Boolean(anchorElement);

  return (
    <LeftPanelContainer
      projectDetails={projectDetails}
      donationStep={donationStep}
      tenant={tenant}
    >
      <LeftPanelHeader>
        {isMobile && (
          <button
            id={"backButtonSingleP"}
            className={"callbackButton"}
            onClick={goBack}
          >
            <BackButton color={"#000"} />
          </button>
        )}
        {projectDetails &&
          projectDetails.purpose !== "planet-cash-signup" &&
          projectDetails.isApproved &&
          projectDetails.isTopProject && (
            <div className={"topProjectBadge theme-light"}>Top Project</div>
          )}
      </LeftPanelHeader>
      {projectDetails ? (
        <div className="donations-info text-white">
          {donationStep &&
            donationStep > 0 &&
            projectDetails.ownerName &&
            (projectDetails.purpose === "trees" ? (
              <a
                rel="noreferrer"
                target="_blank"
                href={`https://www.trilliontreecampaign.org/${projectDetails.id}`}
                style={{ width: "fit-content" }}
              >
                <TPOImage />
              </a>
            ) : (
              <TPOImage />
            ))}
          {paymentSetup &&
            (donationStep === 2 || donationStep === 3) &&
            (projectDetails.purpose === "trees" ||
              projectDetails.purpose === "conservation") && (
              <div className="contact-details-info">
                <div className={"w-100 mt-10 text-white"}>
                  {t("donating")}{" "}
                  <span className="text-bold" style={{ marginRight: "4px" }}>
                    {getFormatedCurrency(
                      i18n.language,
                      currency,
                      paymentSetup.unitCost * quantity
                    )}
                  </span>
                  {paymentSetup.purpose === "trees"
                    ? t("fortreeCountTrees", {
                        count: Number(quantity),
                        treeCount: getFormattedNumber(
                          i18n.language,
                          Number(quantity)
                        ),
                      })
                    : paymentSetup.purpose === "conservation"
                    ? t("forQuantitym2", {
                        quantity: getFormattedNumber(
                          i18n.language,
                          Number(quantity)
                        ),
                      })
                    : []}{" "}
                  {frequency === "monthly"
                    ? t("everyMonth")
                    : frequency === "yearly"
                    ? t("everyYear")
                    : ""}
                </div>
              </div>
            )}

          {paymentSetup &&
            (donationStep === 2 || donationStep === 3) &&
            (projectDetails.purpose === "bouquet" ||
              projectDetails.purpose === "funds") && (
              <div className="contact-details-info">
                <div className={"w-100 mt-10 text-white"}>
                  {t("donating")}{" "}
                  <span className="text-bold" style={{ marginRight: "4px" }}>
                    {getFormatedCurrency(
                      i18n.language,
                      currency,
                      paymentSetup.unitCost * quantity
                    )}
                  </span>
                  {frequency === "monthly"
                    ? t("everyMonth")
                    : frequency === "yearly"
                    ? t("everyYear")
                    : ""}
                </div>
              </div>
            )}

          {donationStep && donationStep > 0 ? (
            <>
              {projectDetails.purpose === "trees" ||
              projectDetails.purpose === "conservation" ? (
                <div className="project-title-container">
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={`https://www.trilliontreecampaign.org/${projectDetails.id}`}
                    className="title-text text-white"
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    {projectDetails.name}
                  </a>
                  {projectDetails?.isApproved && (
                    <div style={{ marginLeft: "10px", marginTop: "auto" }}>
                      <Typography
                        aria-owns={open ? "mouse-over-popover" : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                      >
                        <VerifiedIcon sx={{ color: "#fff" }} />
                      </Typography>
                      <Popover
                        id="mouse-over-popover"
                        className="verified-icon-popup"
                        open={open}
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
                    </div>
                  )}
                </div>
              ) : (
                <h1
                  className="title-text text-white"
                  style={{ marginTop: "10px" }}
                >
                  {projectDetails.name ? projectDetails.name : ""}
                  {projectDetails.name && projectDetails?.isApproved && (
                    <div className="d-inline" style={{ marginLeft: "10px" }}>
                      <Typography
                        aria-owns={open ? "mouse-over-popover" : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                      >
                        <VerifiedIcon sx={{ color: "#fff" }} />
                      </Typography>
                      <Popover
                        id="mouse-over-popover"
                        className="verified-icon-popup"
                        open={open}
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
                    </div>
                  )}
                </h1>
              )}

              {projectDetails.purpose === "funds" ||
              projectDetails.purpose === "bouquet" ? (
                <p className="text-white mt-10">
                  {projectDetails.description ? projectDetails.description : ""}
                </p>
              ) : (
                []
              )}
              {(projectDetails.purpose === "trees" ||
                projectDetails.purpose === "conservation") &&
                projectDetails.ownerName && (
                  <div className="text-white">
                    {t("byOrganization", {
                      organizationName: projectDetails.ownerName,
                    })}
                  </div>
                )}
            </>
          ) : (
            <></>
          )}

          {(donationStep === 1 || donationStep === 2 || donationStep === 3) &&
            giftDetails &&
            isGift &&
            giftDetails.recipientName && (
              <div className="contact-details-info  mt-20 donation-supports-info">
                <p>{t("dedicatedTo")}</p>
                {giftDetails.type === "direct" &&
                giftDetails.recipientTreecounter ? (
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={`https://www.trilliontreecampaign.org/t/${giftDetails.recipientTreecounter}`}
                    className="text-white text-bold"
                  >
                    {giftDetails.recipientName}
                  </a>
                ) : (
                  <p className="text-bold">{giftDetails.recipientName}</p>
                )}

                {giftDetails.message && (
                  <p>
                    {t("message")}: {giftDetails.message}
                  </p>
                )}
              </div>
            )}

          {donationStep === 1 &&
            isPlanetCashActive &&
            onBehalf &&
            onBehalfDonor.firstName && (
              <div className="contact-details-info  mt-10 on-behalf-info">
                <p>{t("onBehalfOf")}</p>
                <p className="text-bold">
                  {onBehalfDonor.firstName + " " + onBehalfDonor.lastName}
                </p>
              </div>
            )}

          {donationStep === 3 && contactDetails.firstname && (
            <div className={"contact-details-info w-100 mt-20"}>
              <p>{t("billingAddress")}</p>
              <p className={`text-bold`}>
                {contactDetails.firstname && contactDetails.firstname}{" "}
                {contactDetails.lastname && contactDetails.lastname}{" "}
              </p>
              <p>{contactDetails.email && contactDetails.email}</p>
              <p>
                {contactDetails.address && contactDetails.address}
                {", "}
                {contactDetails.city && contactDetails.city}
                {", "}
                {contactDetails.zipCode && contactDetails.zipCode}
              </p>
              <p>
                {contactDetails.country &&
                  t(`country:${contactDetails.country.toLowerCase()}`)}
              </p>
              <p>
                {contactDetails.tin
                  ? `${t("common:tinText")} ${" "}${
                      contactDetails.tin && contactDetails.tin
                    }`
                  : null}
              </p>
            </div>
          )}

          {donationID && !(isMobile && router.query.step === "thankyou") && (
            <a
              href={`${process.env.APP_URL}/?context=${donationID}&tenant=${tenant}&country=${country}&locale=${i18n.language}`}
              className="donations-transaction-details mt-20"
              data-test-id="referenceDonation"
            >
              {`Ref - ${donationID}`}
            </a>
          )}
        </div>
      ) : null}
    </LeftPanelContainer>
  );
}

export default LeftPanel;
