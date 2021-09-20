import React from "react";
import { useTranslation } from "next-i18next";
import { getFormattedNumber } from "src/Utils/getFormattedNumber";
import getFormatedCurrency from "src/Utils/getFormattedCurrency";

interface Props {
  projectDetails: any;
  donation: any;
}

const ImageComponent = ({ projectDetails, donation }: Props) => {
  const { t, i18n } = useTranslation(["common", "country", "donate"]);

  const imageRef = React.createRef();

  let currencyFormat = () => {};
  if (donation) {
    currencyFormat = () =>
      getFormatedCurrency(i18n.language, donation.currency, donation.amount);
  }

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
        {projectDetails.purpose === "trees" &&
          t("common:myTreesPlantedByOnLocation", {
            treeCount: getFormattedNumber(
              i18n.language,
              Number(donation.treeCount)
            ),
            location: t("country:" + donation.project.country.toLowerCase()),
          })}

        {projectDetails.purpose === "funds" &&
          t("common:contributedToTpo", {
            amount: currencyFormat(),
            organization: projectDetails.tpo.name,
          })}

        {projectDetails.purpose === "bouquet" && t("Message for Bouquet")}
      </div>
    );
  };
  return (
    <div>
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
