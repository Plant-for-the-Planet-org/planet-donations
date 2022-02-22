import React, { ReactElement, useEffect } from "react";
import ContactsForm from "./Components/ContactsForm";
import { QueryParamContext } from "../Layout/QueryParamContext";
import PaymentsForm from "./Components/PaymentsForm";
import DonationsForm from "./Components/DonationsForm";
import { useTranslation } from "next-i18next";
import PaymentStatus from "./Components/PaymentStatus";
import getFormatedCurrency from "../Utils/getFormattedCurrency";
import { getFormattedNumber } from "../Utils/getFormattedNumber";
import { getTenantBackground } from "./../Utils/getTenantBackground";
import SelectProject from "./Components/SelectProject";
import Image from "next/image";
import getImageUrl from "../Utils/getImageURL";
import {
  CONTACT,
  DONATE,
  PAYMENT,
  SELECT_PROJECT,
  THANK_YOU,
} from "src/Utils/donationStepConstants";
import router, { useRouter } from "next/router";

interface Props {}

function Donations({}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation("common");
  const router = useRouter();

  const {
    paymentSetup,
    donationStep,
    projectDetails,
    setdonationStep,
    allProjects,
  } = React.useContext(QueryParamContext);

  useEffect(() => {
    if (router.query?.step) {
      let step;
      if (donationStep === 4) {
        //if the last step is 'Thankyou' then this will replace the entire route with the initial one on browser back press
        step = SELECT_PROJECT;
        router.replace({
          query: {},
        });
      } else {
        step = router.query?.step;
      }

      switch (step) {
        case SELECT_PROJECT:
          setdonationStep(0);
          break;
        case DONATE:
          setdonationStep(1);
          break;
        case CONTACT:
          setdonationStep(2);
          break;
        case PAYMENT:
          setdonationStep(3);
          break;
        case THANK_YOU:
          setdonationStep(4);
          break;
        default:
          setdonationStep(0);
      }
    }
    return () => {};
  }, [router.query.step]);
  return (
    <div className="donations-container">
      <div className="donations-card-container">
        {/* Left panel */}
        <DonationInfo />

        {/* Right panel */}
        {donationStep === 0 && <SelectProject />}
        {donationStep === 1 && <DonationsForm />}
        {donationStep === 2 && <ContactsForm />}
        {donationStep === 3 && <PaymentsForm />}
        {donationStep === 4 && <PaymentStatus />}
      </div>
    </div>
  );
}

function DonationInfo() {
  const { t, i18n } = useTranslation("common", "country");
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
  } = React.useContext(QueryParamContext);

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
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
        {projectDetails.ownerName.charAt(0)}
      </div>
    );
  };
  return (
    <div
      style={{
        backgroundImage: `url(${getTenantBackground(tenant, projectDetails)})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
      className="donations-info-container"
    >
      {/* <img
        src={getTenantBackground(tenant, projectDetails)}
        className="background-image"
        alt="Background image with trees"
      /> */}
      <div className="background-image-overlay"></div>
      {projectDetails && paymentSetup ? (
        <div className="donations-info text-white">
          {/* <img src={getImageUrl('profile', 'avatar', userInfo.profilePic)} /> */}
          {donationStep > 0 &&
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
          {(donationStep === 2 || donationStep === 3) &&
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

          {(donationStep === 2 || donationStep === 3) &&
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

          {donationStep > 0 ? (
            <>
              {projectDetails.purpose === "trees" ? (
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={`https://www.trilliontreecampaign.org/${projectDetails.id}`}
                  className="title-text text-white"
                  style={{ marginTop: "10px" }}
                >
                  {projectDetails.name}
                </a>
              ) : (
                <h1
                  className="title-text text-white"
                  style={{ marginTop: "10px" }}
                >
                  {projectDetails.name}
                </h1>
              )}

              {projectDetails.purpose === "funds" ||
              projectDetails.purpose === "bouquet" ? (
                <p className="text-white mt-10">{projectDetails.description}</p>
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
                {giftDetails.recipientTreecounter ? (
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

                {giftDetails.giftMessage && (
                  <p>
                    {t("message")}: {giftDetails.giftMessage}
                  </p>
                )}
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
              href={`${process.env.APP_URL}/?context=${donationID}&tenant=${tenant}`}
              className="donations-transaction-details mt-20"
              data-test-id="referenceDonation"
            >
              {`Ref - ${donationID}`}
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Donations;
