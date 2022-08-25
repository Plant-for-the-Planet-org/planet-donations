import React, { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Donations from "./../src/Donations";
import nextI18NextConfig from "../next-i18next.config.js";
import { apiRequest } from "../src/Utils/api";
import Head from "next/head";
import { QueryParamContext } from "../src/Layout/QueryParamContext";
import { getCountryDataBy } from "../src/Utils/countryUtils";
import locales from "../public/static/localeList.json";
import { useRouter } from "next/router";
import countriesData from "./../src/Utils/countriesData.json";
import { setCountryCode } from "src/Utils/setCountryCode";
import { DONATE } from "src/Utils/donationStepConstants";

interface Props {
  projectDetails?: Object;
  donationStep: any;
  giftDetails: Object;
  isGift: boolean;
  resolvedUrl?: any;
  isDirectDonation: boolean;
  hideTaxDeduction: boolean;
  isTaxDeductible: boolean;
  donationID: any;
  shouldCreateDonation: boolean;
  country: any;
  contactDetails: any;
  allowTaxDeductionChange: boolean;
  currency: any;
  paymentSetup: any;
  treecount?: any;
  amount: any;
  meta: { title: string; description: string; image: string; url: string };
  frequency: string;
  tenant: string;
  callbackUrl: string;
  callbackMethod: string;
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
  projectDetails,
}: Props): ReactElement {
  const {
    setdonationStep,
    loadselectedProjects,
    setgiftDetails,
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
    setprojectDetails,
  } = React.useContext(QueryParamContext);

  const router = useRouter();

  React.useEffect(() => {
    if (
      window.location.pathname !== "/" &&
      router.locales?.filter((locale) => locale === router.locale)[0]
    ) {
      window.location.href =
        window.location.origin + "/" + window.location.search;
    }
  }, [router.locale]);

  React.useEffect(() => {
    setdonationID(donationID);
    if (isDirectDonation) {
      sethideTaxDeduction(hideTaxDeduction);
      setIsTaxDeductible(isTaxDeductible);
      setshouldCreateDonation(shouldCreateDonation);
      setContactDetails(contactDetails);
      setallowTaxDeductionChange(allowTaxDeductionChange);
      setcurrency(currency);
      setpaymentSetup(paymentSetup);
      setisDirectDonation(isDirectDonation);
      setfrequency(frequency);
      setquantity(Math.round(amount / paymentSetup.unitCost));
    }
    setcallbackUrl(callbackUrl);
    setCallbackMethod(callbackMethod);
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
  // If gift details are present set gift
  if (giftDetails && isGift) {
    setgiftDetails(giftDetails);
    setisGift(true);
  }

  React.useEffect(() => {
    setdonationStep(donationStep);
    if (!donationStep) {
      loadselectedProjects();
    }
  }, [donationStep]);

  const defaultLanguage = router.query.locale ? router.query.locale : "en";
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

export async function getServerSideProps(context: any) {
  let donationStep = 0;
  let showErrorCard = false;
  let projectDetails = null;

  // Variables that will be affected with Gift details
  let isGift = false;
  let giftDetails = {};
  let frequency = "once";
  // Variables that will be affected with context
  let hideTaxDeduction = false;
  let isTaxDeductible = false;
  let donationID = null;
  let shouldCreateDonation = false;
  let country = "";
  let isDirectDonation = false;
  let contactDetails = {};
  let treecount = 50;
  let allowTaxDeductionChange = true;
  let currency = "EUR";
  let paymentSetup = {};
  let amount = 0;
  let tenant = "ten_I9TW3ncG";
  let callbackUrl = "";
  let callbackMethod = "";
  let locale = "en";

  function setshowErrorCard() {
    showErrorCard = true;
  }
  if (context.query.tenant) {
    tenant = context.query.tenant;
  }

  // Country = country => This can be received from the URL, can also be set by the user, can be extracted from browser location (config API)
  if (context.query.country) {
    const found = countriesData.some(
      (country) =>
        country.countryCode?.toUpperCase() ===
        context.query.country?.toUpperCase()
    );
    if (found) {
      country = context.query.country.toUpperCase();
    }
  }
  if (context.query.locale) {
    locale = context.query.locale;
  }
  // Set project details if there is to (project slug) in the query params
  if (
    (context.query.to && !context.query.context) ||
    context.query.step === DONATE
  ) {
    const to = context.query?.to?.replace(/\//g, "") || "";
    donationStep = 1;
    if (to !== "planetCash") {
      try {
        const requestParams = {
          url: `/app/paymentOptions/${to}?country=${country}`,
          setshowErrorCard,
          tenant,
          locale,
        };
        const paymentOptionsResponse = await apiRequest(requestParams);
        if (paymentOptionsResponse.data) {
          projectDetails = {
            id: paymentOptionsResponse.data.id,
            name: paymentOptionsResponse.data.name,
            description: paymentOptionsResponse.data.description,
            purpose: paymentOptionsResponse.data.purpose,
            ownerName: paymentOptionsResponse.data.ownerName,
            taxDeductionCountries:
              paymentOptionsResponse.data.taxDeductionCountries,
            projectImage: paymentOptionsResponse.data.image,
            ownerAvatar: paymentOptionsResponse.data.ownerAvatar,
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
      };
      const donation: any = await apiRequest(requestParams);

      const paymentStatusForStep4 = ["success", "paid", "failed", "pending"];
      const paymentStatusForStep3 = ["initiated", "draft"];
      const queryMethodForStep4 = ["Sofort", "Giropay"];
      const queryRedirectStatus = ["succeeded", "failed"];

      if (donation.status === 200) {
        const donorData = donation.data.donor;
        donationID = context.query.context;
        // if the donation is present means the donation is already created
        // Set shouldCreateDonation as false
        shouldCreateDonation = false;
        // fetch project - payment setup
        tenant = donation.data.tenant;
        if (donation.data.frequency) {
          frequency = donation.data.frequency;
        }
        if (donation.data.taxDeductionCountry) {
          country = donation.data.taxDeductionCountry;
          isTaxDeductible = true;
        } else {
          hideTaxDeduction = true;
          country = donorData.country;
        }
        if (donation.data.metadata) {
          callbackMethod = donation.data.metadata?.callback_method;
          callbackUrl = donation.data.metadata?.callback_url;
        }
        // This will fetch the payment options
        try {
          const requestParams = {
            url: `/app/paymentOptions/${donation.data.destination.id}?country=${country}`,
            setshowErrorCard,
            tenant,
            locale,
          };
          const paymentSetupData: any = await apiRequest(requestParams);
          if (paymentSetupData.data) {
            currency = paymentSetupData.data.currency;
            paymentSetup = paymentSetupData.data;
            projectDetails = {
              id: paymentSetupData.data.id,
              name: paymentSetupData.data.name,
              description: paymentSetupData.data.description,
              purpose: paymentSetupData.data.purpose,
              ownerName: paymentSetupData.data.ownerName,
              taxDeductionCountries:
                paymentSetupData.data.taxDeductionCountries,
              projectImage: paymentSetupData.data.image,
              ownerAvatar: paymentSetupData.data.ownerAvatar,
            };
            donationStep = 3;
          }
        } catch (err) {
          // console.log(err);
        }
        allowTaxDeductionChange = false;
        treecount = donation.data.treeCount;
        amount = donation.data.amount;
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
          };
        }

        // Check if the donation status is paid or successful - if yes directly show thank you page
        // other payment statuses paymentStatus =  'refunded'; 'referred'; 'in-dispute'; 'dispute-lost';
        if (
          queryMethodForStep4.includes(context.query.method) &&
          queryRedirectStatus.includes(context.query.redirect_status) &&
          context.query.payment_intent
        ) {
          donationStep = 4;
        } else if (
          paymentStatusForStep4.includes(donation.data.paymentStatus)
        ) {
          donationStep = 4;
        } else if (
          paymentStatusForStep3.includes(donation.data.paymentStatus)
        ) {
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

  // Set gift details if there is s (support link) in the query params
  if (context.query.s) {
    try {
      const requestParams = {
        url: `/app/profiles/${context.query.s}`,
        setshowErrorCard,
        tenant,
      };
      const newProfile = await apiRequest(requestParams);
      if (newProfile.data.type !== "tpo") {
        isGift = true;
        giftDetails = {
          recipientName: newProfile.data.displayName,
          recipientEmail: "",
          giftMessage: "",
          type: "direct",
          recipientTreecounter: newProfile.data.slug,
        };
      }
    } catch (err) {
      console.log("Error", err);
    }
  }
  let title = `Donate with Plant-for-the-Planet`;
  let description = `Make tax deductible donations to over 160+ restoration and conservation projects. Your journey to a trillion trees starts here.`;

  let url =
    process.env.APP_URL +
    "/api/image?path=" +
    process.env.APP_URL +
    resolvedUrl;

  if (Object.keys(context.query).length > 0 && context.query.to && !context.query.step) {
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
      ...(await serverSideTranslations(
        context.locale,
        ["common", "country", "donate"],
        nextI18NextConfig
      )),
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
      treecount,
      allowTaxDeductionChange,
      currency,
      paymentSetup,
      amount,
      meta: { title, description, image, url },
      frequency,
      tenant,
      callbackMethod,
      callbackUrl,
    }, // will be passed to the page component as props
  };
}
