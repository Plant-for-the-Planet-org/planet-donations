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

interface Props {
  projectDetails: Object;
  donationStep: any;
  giftDetails: Object;
  isGift: boolean;
  resolvedUrl: any;
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
  treecount: any;
  amount: any;
}

function index({
  projectDetails,
  donationStep,
  giftDetails,
  isGift,
  resolvedUrl,
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
  treecount,
  amount,
}: Props): ReactElement {
  const {
    setprojectDetails,
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
  } = React.useContext(QueryParamContext);

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
      if (projectDetails && projectDetails.purpose === "trees") {
        setquantity(treecount);
      } else {
        setquantity(amount / paymentSetup.unitCost);
      }
    }
    // XX is hidden country and T1 is Tor browser
    // if (country === "XX" || country === "T1" || country === "") {
    //   setcountry("DE");
    // } else {
    //   if (country) {
    //     setcountry(country);
    //   } else if (localStorage.getItem("countryCode")) {
    //     setcountry(localStorage.getItem("countryCode"));
    //   }
    // }
    setCountryCode({ setcountry, setcurrency, country });
  }, []);

  // If gift details are present set gift
  if (giftDetails && isGift) {
    setgiftDetails(giftDetails);
    setisGift(true);
  }

  // If project details are present set project details
  if (projectDetails) {
    setprojectDetails(projectDetails);
  }

  React.useEffect(() => {
    setdonationStep(donationStep);
    if (!donationStep) {
      loadselectedProjects();
    }
  }, [donationStep]);

  let title = `Donate with Plant-for-the-Planet`;

  let description = `Make tax deductible donations to over 160+ restoration and conservation projects. Your journey to a trillion trees starts here.`;
  const url = encodeURIComponent(process.env.APP_URL + resolvedUrl);
  const image = `https://s.wordpress.com/mshots/v1/${url}?w=1200&h=770.jpg`;

  if (projectDetails) {
    title = `${projectDetails.name} - Donate with Plant-for-the-Planet`;
    if (projectDetails.purpose === "trees") {
      description = `Plant trees with ${
        projectDetails.tpo
          ? projectDetails.tpo?.name
          : projectDetails.tpoData?.name
      } in ${
        getCountryDataBy("countryCode", projectDetails.country)?.countryName
      }. Your journey to a trillion trees starts here.`;
    } else if (projectDetails.purpose === "bouquet") {
      description = `Make a contribution to ${projectDetails.name}. ${
        projectDetails.description ? projectDetails.description : ""
      } Your journey to a trillion trees starts here.`;
    }
  }
  if (giftDetails && giftDetails.recipientName) {
    title = `Join ${giftDetails.recipientName} - Donate with Plant-for-the-Planet`;
  }

  const router = useRouter();

  const defaultLanguage = router.query.locale ? router.query.locale : "en";

  return (
    <div
      style={{ flexGrow: 1, backgroundColor: "var(--background-color-dark)" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
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

        <meta property="og:site_name" content={title} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content={image}></meta>
        <meta property="twitter:url" content={url} />
        <meta name="twitter:description" content={description} />

        {isDirectDonation ? <meta name="robots" content="noindex" /> : <></>}
      </Head>
      <Donations />
    </div>
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
  function setshowErrorCard() {
    showErrorCard = true;
  }

  // Set project details if there is to (project slug) in the query params
  if (
    (context.query.to && !context.query.context) ||
    context.query.step === "donate"
  ) {
    const to = context.query.to.replace(/\//g, "");
    donationStep = 1;
    try {
      const requestParams = {
        url: `/app/projects/${to}`,
        setshowErrorCard,
      };
      const project = await apiRequest(requestParams);
      if (project.data) {
        projectDetails = project.data;
        donationStep = 1;
      }
    } catch (err) {
      donationStep = 0;
      console.log("err", err);
    }
  } else {
    if (!context.query.context) {
      donationStep = 0;
    }
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
    // } else {
    //   try {
    //     const requestParams = {
    //       url: `/app/config`,
    //       setshowErrorCard,
    //     };
    //     const config: any = await apiRequest(requestParams);
    //     if (config) {
    //       country = config.data.country.toUpperCase();
    //     }
    //   } catch (err) {
    //     console.log(err, "Error");
    //   }
  }

  // Set donation details if context (created donation ID) present in the URL
  if (context.query.context) {
    try {
      const requestParams = {
        url: `/app/donations/${context.query.context}`,
        setshowErrorCard,
      };
      const donation: any = await apiRequest(requestParams);

      if (donation.status === 200) {
        donationID = context.query.context;
        // if the donation is present means the donation is already created
        // Set shouldCreateDonation as false
        shouldCreateDonation = false;
        // fetch project - payment setup
        try {
          const requestParams = {
            url: `/app/projects/${donation.data.project.id}`,
            setshowErrorCard,
          };
          const project = await apiRequest(requestParams);
          if (project.data) {
            projectDetails = project.data;
            donationStep = 3;
          }
        } catch (err) {
          donationStep = 0;
          console.log("err", err);
        }

        if (donation.data.taxDeductionCountry) {
          country = donation.data.taxDeductionCountry;
          isTaxDeductible = true;
        } else {
          hideTaxDeduction = true;
          country = donation.data.donor.country;
        }

        // This will fetch the payment options
        try {
          const requestParams = {
            url: `/app/projects/${donation.data.project.id}/paymentOptions?country=${country}`,
            setshowErrorCard,
          };
          const paymentSetupData: any = await apiRequest(requestParams);
          if (paymentSetupData.data) {
            currency = paymentSetupData.data.currency;
            paymentSetup = paymentSetupData.data;
          }
        } catch (err) {
          // console.log(err);
        }

        allowTaxDeductionChange = false;

        treecount = donation.data.treeCount;
        amount = donation.data.amount;
        // Setting contact details from donor details
        if (donation.data.donor) {
          contactDetails = {
            firstname: donation.data.donor.firstname
              ? donation.data.donor.firstname
              : "",
            lastname: donation.data.donor.lastname
              ? donation.data.donor.lastname
              : "",
            email: donation.data.donor.email ? donation.data.donor.email : "",
            address: donation.data.donor.address
              ? donation.data.donor.address
              : "",
            city: donation.data.donor.city ? donation.data.donor.city : "",
            zipCode: donation.data.donor.zipCode
              ? donation.data.donor.zipCode
              : "",
            country: donation.data.donor.country
              ? donation.data.donor.country
              : "",
            companyname: donation.data.donor.companyname
              ? donation.data.donor.companyname
              : "",
          };
        }

        // Check if the donation status is paid or successful - if yes directly show thank you page
        // other payment statuses paymentStatus =  'refunded'; 'referred'; 'in-dispute'; 'dispute-lost';
        if (
          (context.query.method === "Sofort" ||
            context.query.method === "Giropay") &&
          (context.query.redirect_status === "succeeded" ||
            context.query.redirect_status === "failed") &&
          context.query.payment_intent
        ) {
          donationStep = 4;
        } else if (
          donation.data.paymentStatus === "success" ||
          donation.data.paymentStatus === "paid" ||
          donation.data.paymentStatus === "failed" ||
          donation.data.paymentStatus === "pending"
        ) {
          donationStep = 4;
        } else if (
          donation.data.paymentStatus === "initiated" ||
          donation.data.paymentStatus === "draft"
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
  const resolvedUrl = context.resolvedUrl;

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
    }, // will be passed to the page component as props
  };
}
