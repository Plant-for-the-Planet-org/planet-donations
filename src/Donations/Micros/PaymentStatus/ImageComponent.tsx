import React, { ReactElement, RefObject } from "react";
import { useTranslation } from "next-i18next";
import { getFormattedNumber } from "src/Utils/getFormattedNumber";
import getFormattedCurrency from "src/Utils/getFormattedCurrency";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { FetchedProjectDetails } from "src/Common/Types";
import { Donation } from "@planet-sdk/common/build/types/donation";

interface Props {
  projectDetails: FetchedProjectDetails;
  donation: Donation;
  imageRef: RefObject<HTMLDivElement>;
}

const ImageComponent = ({
  projectDetails,
  donation,
  imageRef,
}: Props): ReactElement => {
  const { t, i18n } = useTranslation(["common", "country", "donate"]);

  const { profile } = React.useContext(QueryParamContext);
  let currencyFormat = () => {};
  if (donation) {
    currencyFormat = () =>
      getFormattedCurrency(
        i18n.language,
        donation.currency,
        Number(donation.amount),
      );
  }

  const pluralProfileTypes = [
    "tpo",
    "company",
    "organization",
    "government",
    "education",
  ];

  const ImageHeaderText = () => {
    return (
      <p
        className={"thankyou-image-header"}
        dangerouslySetInnerHTML={{
          __html: t("common:thankyouHeaderText"),
        }}
      />
    );
  };

  const ImageDonationURL = () => {
    return (
      <p className={"donation-url"}>
        {t("common:plantTreesAtURL", {
          url: "www.plant-for-the-planet.org",
        })}
      </p>
    );
  };

  const ImageDonationText = () => {
    return (
      <div className={"donation-count p-20"}>
        {projectDetails?.purpose === "trees" &&
          (donation.unitType === "tree" && donation.units
            ? t("common:myTreesPlantedByOnLocation", {
                treeCount: getFormattedNumber(
                  i18n.language,
                  Number(donation.units),
                ),
                location: t(
                  "country:" + donation.destination.country.toLowerCase(),
                ),
              })
            : t("common:restorationDonationShareDetails", {
                amount: getFormattedCurrency(
                  i18n.language,
                  donation.currency,
                  Number(donation.amount),
                ),
                location: t(
                  "country:" + donation.destination.country.toLowerCase(),
                ),
              }))}
        {projectDetails?.purpose === "conservation" &&
          t(
            `common:${
              profile?.type && pluralProfileTypes.includes(profile?.type)
                ? "weDonatedForestOnLocation"
                : "iDonatedForestOnLocation"
            }`,
            {
              amount: getFormattedCurrency(
                i18n.language,
                donation.currency,
                Number(donation.amount),
              ),
              location: t(
                "country:" + donation.destination.country.toLowerCase(),
              ),
            },
          )}
        {projectDetails?.purpose === "funds" &&
          t("common:contributedToTpo", {
            amount: currencyFormat(),
            organization: projectDetails.ownerName,
          })}

        {projectDetails?.purpose === "bouquet" &&
          t("common:myContributionIsPartOfThat")}
      </div>
    );
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* hidden div for image download */}
      <div
        className="temp-image"
        style={{ width: "0px", height: "0px", overflow: "hidden" }}
      >
        <div className={"thankyou-image"} ref={imageRef}>
          <ImageHeaderText />
          <ImageDonationText />
          <ImageDonationURL />
        </div>
      </div>
      <div className={"thankyou-image"}>
        <ImageHeaderText />
        <ImageDonationText />
        <ImageDonationURL />
      </div>
    </div>
  );
};

export default ImageComponent;
