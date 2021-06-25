import React, { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Donations from "./../src/Donations";
import nextI18NextConfig from "../next-i18next.config.js";
import { apiRequest } from "../src/Utils/api";
import Head from "next/head";
import { QueryParamContext } from "../src/Layout/QueryParamContext";
import { getCountryDataBy } from "../src/Utils/countryUtils";
import locales from "../public/static/localeList.json";
import { useRouter } from "next/dist/client/router";

interface Props {
  projectDetails: Object;
  donationStep: any;
  giftDetails: Object;
  isGift: boolean;
  resolvedUrl:any;
}

function index({
  projectDetails,
  donationStep,
  giftDetails,
  isGift,
  resolvedUrl,
}: Props): ReactElement {
  const {
    setprojectDetails,
    setdonationStep,
    loadselectedProjects,
    setgiftDetails,
    setisGift,
  } = React.useContext(QueryParamContext);

  if (giftDetails && isGift) {
    setgiftDetails(giftDetails);
    setisGift(true);
  }
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
  const url = encodeURIComponent(process.env.APP_URL+resolvedUrl);
  const image= `https://s.wordpress.com/mshots/v1/${url}?w=1200&h=770`;
  
  if (projectDetails) {
    title = `${projectDetails.name} - Donate with Plant-for-the-Planet`;
    description = `Plant trees with ${projectDetails.tpo.name} in ${
      getCountryDataBy("countryCode", projectDetails.country)?.countryName
    }. Your journey to a trillion trees starts here.`;
  }
  if(giftDetails && giftDetails.recipientName){
    title = `Join ${giftDetails.recipientName} - Donate with Plant-for-the-Planet`;
  }

  const router = useRouter();  
  return (
    <div
      style={{ flexGrow: 1 }}
      className="d-flex justify-content-center align-items-center"
    >
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content="" />

        <meta property="og:locale" content={locales.find(locale => locale.key === router.query.locale )?.value} />
        {locales.map((locale) => {
          if (locale.key !== router.query.locale) {
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
        <meta
          property="og:url"
          content={url}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content={image}></meta>
        <meta
          property="twitter:url"
          content={url}
        />
        <meta
          property="twitter:title"
          content="Donate with Plant-for-the-Planet"
        />
        <meta name="twitter:description" content={description} />
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
  let isGift = false;
  let giftDetails = {};

  function setshowErrorCard() {
    showErrorCard = true;
  }

  if (context.query.to && !context.query.context) {
    donationStep = 1;
    try {
      const requestParams = {
        url: `/app/projects/${context.query.to}`,
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
        ["common", "country"],
        nextI18NextConfig
      )),
      donationStep: donationStep,
      showErrorCard: showErrorCard,
      projectDetails: projectDetails,
      giftDetails: giftDetails,
      isGift: isGift,
      resolvedUrl:resolvedUrl
    }, // will be passed to the page component as props
  };
}
