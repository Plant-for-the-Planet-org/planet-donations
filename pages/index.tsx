import React, { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Donations from "./../src/Donations";
import { apiRequest } from "../src/Utils/api";
import Head from "next/head";
import { QueryParamContext } from "../src/Layout/QueryParamContext";
import locales from "../public/static/localeList.json";
import { useRouter } from "next/router";
import countriesData from "./../src/Utils/countriesData.json";
import { setCountryCode } from "src/Utils/setCountryCode";
import { DONATE } from "src/Utils/donationStepConstants";
import {
  SentGift,
  FetchedProjectDetails,
  PaymentOptions,
  PlanetCashSignupDetails,
} from "src/Common/Types";
import {
  Donation,
  ContactDetails,
} from "@planet-sdk/common/build/types/donation";
import { GetServerSideProps } from "next/types";

interface Props {
  projectDetails?: FetchedProjectDetails | PlanetCashSignupDetails;
  donationStep: number | null;
  giftDetails: SentGift | null;
  isGift: boolean;
  resolvedUrl?: string;
  isDirectDonation: boolean;
  hideTaxDeduction: boolean;
  isTaxDeductible: boolean;
  donationID: string | null;
  shouldCreateDonation: boolean;
  country: string;
  contactDetails: ContactDetails;
  allowTaxDeductionChange: boolean;
  currency: string;
  paymentSetup: PaymentOptions;
  units?: number;
  amount: number;
  meta: { title: string; description: string; image: string; url: string };
  frequency: string;
  tenant: string;
  callbackUrl: string;
  callbackMethod: string;
  utmCampaign: string;
  utmMedium: string;
  utmSource: string;
}

function index({
  donationStep,
  giftDetails,
  isGift,
  isDirectDonation,
  hideTaxDeduction,
  isTaxDeductible,
  donationID,
  shouldCreateDonation,
  country,
  contactDetails,
  allowTaxDeductionChange,
  currency,
  paymentSetup,
  amount,
  meta,
  frequency,
  tenant,
  callbackUrl,
  callbackMethod,
  utmCampaign,
  utmMedium,
  utmSource,
  projectDetails,
}: Props): ReactElement {
  const {
    setdonationStep,
    setSelectedProjects,
    loadselectedProjects,
    setGiftDetails,
    setisGift,
    setpaymentSetup,
    setcurrency,
    setContactDetails,
    setcountry,
    setIsTaxDeductible,
    setshouldCreateDonation,
    setdonationID,
    sethideTaxDeduction,
    setallowTaxDeductionChange,
    setisDirectDonation,
    setquantity,
    setfrequency,
    settenant,
    setcallbackUrl,
    setCallbackMethod,
    setUtmCampaign,
    setUtmMedium,
    setUtmSource,
    setprojectDetails,
  } = React.useContext(QueryParamContext);

  const router = useRouter();
  const { i18n } = useTranslation();
  const defaultLanguage = i18n.language;

  React.useEffect(() => {
    setdonationID(donationID);
    if (isDirectDonation) {
      sethideTaxDeduction(hideTaxDeduction);
      setIsTaxDeductible(isTaxDeductible);
      setshouldCreateDonation(shouldCreateDonation);
      if (contactDetails) setContactDetails(contactDetails);
      setallowTaxDeductionChange(allowTaxDeductionChange);
      setcurrency(currency);
      setpaymentSetup(paymentSetup);
      setisDirectDonation(isDirectDonation);
      setfrequency(frequency);
      setquantity(Math.round(amount / paymentSetup.unitCost));
    }
    setcallbackUrl(callbackUrl);
    setCallbackMethod(callbackMethod);
    utmCampaign && setUtmCampaign(utmCampaign);
    utmMedium && setUtmMedium(utmMedium);
    utmSource && setUtmSource(utmSource);
    setCountryCode({ setcountry, setcurrency, country });
  }, []);

  // If project details are present set project details
  // This will be set from getServerSideProps.

  React.useEffect(() => {
    if (projectDetails) {
      setprojectDetails(projectDetails);
    }
  }, [projectDetails]);

  settenant(tenant);

  // If gift details are present, initialize gift in context
  React.useEffect(() => {
    if (giftDetails && isGift) {
      setGiftDetails(giftDetails);
      setisGift(true);
    }
  }, []);

  React.useEffect(() => {
    setdonationStep(donationStep);
    if (!donationStep) {
      setSelectedProjects([]);
      loadselectedProjects();
    }
  }, [donationStep, defaultLanguage]);

  if (router.query.context) {
    setfrequency(frequency);
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content="" />

        <meta
          property="og:locale"
          content={
            locales.find((locale) => locale.key === defaultLanguage)?.value
          }
        />
        {locales.map((locale) => {
          if (locale.key !== defaultLanguage) {
            return (
              <meta
                key={`og:locale:alternate${locale.value}`}
                property="og:locale:alternate"
                content={locale.value}
              />
            );
          }
        })}

        <meta property="og:site_name" content={meta.title} />

        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta name="description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={meta.url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={meta.title} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content={meta.image}></meta>
        <meta property="twitter:url" content={meta.url} />
        <meta name="twitter:description" content={meta.description} />

        {isDirectDonation ? <meta name="robots" content="noindex" /> : <></>}
      </Head>
      <div
        style={{ flexGrow: 1, backgroundColor: "var(--background-color-dark)" }}
        className="d-flex justify-content-center align-items-center"
      >
        <Donations />
      </div>
    </>
  );
}

export default index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  let donationStep = 0;
  let showErrorCard = false;
  let projectDetails: FetchedProjectDetails | null = null;

  // Variables that will be affected with Gift details
  let isGift = false;
  let giftDetails: SentGift | null = null;
  let frequency = "once";
  // Variables that will be affected with context
  let hideTaxDeduction = false;
  let isTaxDeductible = false;
  let donationID = null;
  let shouldCreateDonation = false;
  let country = "";
  let isDirectDonation = false;
  let contactDetails: ContactDetails | null = null;
  let units: number | null = 50;
  let allowTaxDeductionChange = true;
  let currency = "EUR";
  let paymentSetup: PaymentOptions | null = null;
  let amount = 0;
  let tenant = "ten_I9TW3ncG";
  let callbackUrl = "";
  let callbackMethod = "";
  let utmCampaign = "";
  let utmMedium = "";
  let utmSource = "";
  const locale = context.locale || "en";

  function setshowErrorCard() {
    showErrorCard = true;
  }
  if (typeof context.query.tenant === "string") {
    tenant = context.query.tenant;
  }

  // Country = country => This can be received from the URL, can also be set by the user, can be extracted from browser location (config API)
  if (typeof context.query.country === "string") {
    const queryCountry = context.query.country;
    const found = countriesData.some(
      (country) =>
        country.countryCode?.toUpperCase() === queryCountry.toUpperCase()
    );
    if (found) {
      country = queryCountry.toUpperCase();
    }
  }

  // Set project details if there is to (project slug) in the query params
  if (
    ((context.query.to && !context.query.context) ||
      context.query.step === DONATE) &&
    typeof context.query.to === "string"
  ) {
    const to = context.query?.to?.replace(/\//g, "") || "";
    donationStep = 1;
    if (to?.toString().toLowerCase() !== "planetcash") {
      try {
        const requestParams = {
          url: `/app/paymentOptions/${to}?country=${country}`,
          setshowErrorCard,
          tenant,
          locale,
        };
        const paymentOptionsResponse = await apiRequest(requestParams);
        const paymentOptionsData: PaymentOptions = paymentOptionsResponse?.data;
        if (paymentOptionsData) {
          projectDetails = {
            id: paymentOptionsData.id,
            name: paymentOptionsData.name,
            description: paymentOptionsData.description,
            purpose: paymentOptionsData.purpose,
            ownerName: paymentOptionsData.ownerName,
            taxDeductionCountries: paymentOptionsData.taxDeductionCountries,
            image: paymentOptionsData.image,
            ownerAvatar: paymentOptionsData.ownerAvatar,
            isApproved: paymentOptionsData.isApproved ? true : false,
            isTopProject: paymentOptionsData.isTopProject ? true : false,
          };
          donationStep = 1;
        }
      } catch (err) {
        donationStep = 0;
        console.log("err", err);
      }
    }
  } else {
    if (!context.query.context) {
      donationStep = 0;
    }
  }
  const resolvedUrl = context.resolvedUrl;

  // Set donation details if context (created donation ID) present in the URL
  if (context.query.context) {
    try {
      const requestParams = {
        url: `/app/donations/${context.query.context}`,
        setshowErrorCard,
        tenant,
        locale,
      };
      const donationResponse: any = await apiRequest(requestParams);

      const paymentStatusForStep4 = ["success", "paid", "failed", "pending"];
      const paymentStatusForStep3 = ["initiated", "draft"];
      const queryMethodForStep4 = ["Sofort", "Giropay"];
      const queryRedirectStatus = ["succeeded", "failed"];

      if (donationResponse.status === 200) {
        const donation: Donation = donationResponse.data;
        const donorData = donation.donor as ContactDetails;
        donationID = context.query.context;
        // if the donation is present means the donation is already created
        // Set shouldCreateDonation as false
        shouldCreateDonation = false;
        // fetch project - payment setup
        tenant = donation.tenant;
        if (donation.frequency) {
          frequency = donation.frequency;
        }
        if (donation.taxDeductionCountry) {
          country = donation.taxDeductionCountry;
          isTaxDeductible = true;
        } else if (donation.gateway === "planet-cash") {
          hideTaxDeduction = true;
          country = donation.destination.country;
        } else {
          hideTaxDeduction = true;
          country = donorData.country;
        }
        if (donation.metadata) {
          callbackMethod = donation.metadata.callback_method || "";
          callbackUrl = donation.metadata.callback_url || "";
          utmCampaign = donation.metadata.utm_campaign || "";
          utmMedium = donation.metadata.utm_medium || "";
          utmSource = donation.metadata.utm_source || "";
        }
        // This will fetch the payment options
        try {
          const requestParams = {
            url: `/app/paymentOptions/${donation.destination.id}?country=${country}`,
            setshowErrorCard,
            tenant,
            locale,
          };
          const paymentSetupResponse: any = await apiRequest(requestParams);
          const paymentSetupData: PaymentOptions = paymentSetupResponse?.data;
          if (paymentSetupData) {
            currency = paymentSetupData.currency;
            paymentSetup = paymentSetupData;
            projectDetails = {
              id: paymentSetupData.id,
              name: paymentSetupData.name,
              description: paymentSetupData.description,
              purpose: paymentSetupData.purpose,
              ownerName: paymentSetupData.ownerName,
              taxDeductionCountries: paymentSetupData.taxDeductionCountries,
              image: paymentSetupData.image,
              ownerAvatar: paymentSetupData.ownerAvatar,
              isApproved: paymentSetupData.isApproved ? true : false,
              isTopProject: paymentSetupData.isTopProject ? true : false,
            };
            donationStep = 3;
          }
        } catch (err) {
          // console.log(err);
        }
        allowTaxDeductionChange = false;
        units = donation.units;
        amount = donation.amount;
        // Setting contact details from donor details
        if (donorData) {
          contactDetails = {
            firstname: donorData.firstname || "",
            lastname: donorData.lastname || "",
            email: donorData.email || "",
            address: donorData.address || "",
            city: donorData.city || "",
            zipCode: donorData.zipCode || "",
            country: donorData.country || "",
            companyname: donorData.companyname || "",
            tin: donorData.tin || "",
          };
        }

        // Check if the donation status is paid or successful - if yes directly show thank you page
        // other payment statuses paymentStatus =  'refunded'; 'referred'; 'in-dispute'; 'dispute-lost';
        if (
          typeof context.query.method === "string" &&
          typeof context.query.redirect_status === "string" &&
          queryMethodForStep4.includes(context.query.method) &&
          queryRedirectStatus.includes(context.query.redirect_status) &&
          context.query.payment_intent
        ) {
          donationStep = 4;
        } else if (paymentStatusForStep4.includes(donation.paymentStatus)) {
          donationStep = 4;
        } else if (paymentStatusForStep3.includes(donation.paymentStatus)) {
          // Check if all contact details are present - if not send user to step 2 else step 3
          // Check if all payment cards are present - if yes then show it on step 3
          isDirectDonation = true;
          donationStep = 3;
        }
      } else {
        // SET Error that no donation is found
        donationStep = 1;
      }
    } catch (err) {
      donationStep = 0;
    }
  }

  if (typeof context.query.utm_campaign === "string")
    utmCampaign = context.query.utm_campaign;
  if (typeof context.query.utm_medium === "string")
    utmMedium = context.query.utm_medium;
  if (typeof context.query.utm_source === "string")
    utmSource = context.query.utm_source;

  // Set gift details if there is s (support link) in the query params
  if (context.query.s) {
    try {
      const requestParams = {
        url: `/app/profiles/${context.query.s}`,
        setshowErrorCard,
        tenant,
        locale,
      };
      const newProfile = await apiRequest(requestParams);
      if (newProfile.data.type !== "tpo") {
        isGift = true;
        giftDetails = {
          recipientName: newProfile.data.displayName,
          recipientEmail: "",
          message: "",
          type: "direct",
          recipient: newProfile.data.id,
          recipientTreecounter: newProfile.data.slug,
        };
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  // Set gift details if gift = true in the query params (only for tree projects)
  if (context.query.gift === "true" && projectDetails?.purpose === "trees") {
    isGift = true;
    giftDetails = {
      type: "invitation",
      recipientName: "",
      recipientEmail: "",
      message: "",
    };
  }

  let title = `Donate with Plant-for-the-Planet`;
  let description = `Make tax deductible donations to over 160+ restoration and conservation projects. Your journey to a trillion trees starts here.`;

  let url =
    process.env.APP_URL +
    "/api/image?path=" +
    process.env.APP_URL +
    resolvedUrl;

  if (
    Object.keys(context.query).length > 0 &&
    context.query.to &&
    !context.query.step
  ) {
    url = url + "&step=donate";
  }

  const image = url;

  if (projectDetails) {
    title = `${projectDetails.name} - Donate with Plant-for-the-Planet`;
    if (projectDetails.purpose === "trees") {
      description = `Plant trees with ${projectDetails.ownerName}. Your journey to a trillion trees starts here.`;
    } else if (
      projectDetails.purpose === "conservation" &&
      !projectDetails.description
    ) {
      description = `Conserve forests with  ${projectDetails.ownerName}. Your journey to a trillion trees starts here.`;
    } else if (
      (projectDetails.purpose === "bouquet" ||
        projectDetails.purpose === "funds" ||
        projectDetails.purpose === "conservation") &&
      projectDetails.description
    ) {
      description = projectDetails.description;
    }
  }
  if (giftDetails && giftDetails.recipientName) {
    title = `Join ${giftDetails.recipientName} - Donate with Plant-for-the-Planet`;
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "country",
        "donate",
      ])),
      donationStep: donationStep,
      showErrorCard: showErrorCard,
      projectDetails: projectDetails,
      giftDetails: giftDetails,
      isGift: isGift,
      resolvedUrl: resolvedUrl,
      // Variables below will only be set if the donation is already created
      isDirectDonation,
      hideTaxDeduction,
      isTaxDeductible,
      donationID,
      shouldCreateDonation,
      country,
      contactDetails,
      units,
      allowTaxDeductionChange,
      currency,
      paymentSetup,
      amount,
      meta: { title, description, image, url },
      frequency,
      tenant,
      callbackMethod,
      callbackUrl,
      utmCampaign,
      utmMedium,
      utmSource,
    }, // will be passed to the page component as props
  };
};
