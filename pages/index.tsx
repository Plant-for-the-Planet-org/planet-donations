import React, { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Donations from "./../src/Donations";
import nextI18NextConfig from "../next-i18next.config.js";
import { apiRequest } from "../src/Utils/api";
import { ProjectTypes } from "../src/Common/Types";
import {
  getFilteredProjects,
  getRandomProjects,
} from "../src/Utils/projects/filterProjects";
interface Props {
  projectDetails: Object;
}

function index({ projectDetails }: Props): ReactElement {
  console.log("pageProps", projectDetails);

  return (
    <div
      style={{ flexGrow: 1 }}
      className="d-flex justify-content-center align-items-center"
    >
      <Donations />
    </div>
  );
}

export default index;

export async function getServerSideProps(context: any) {
  
  let donationStep = 0;
  let showErrorCard = false;
  let projectDetails = null;
  let allProjects = null;

  function setshowErrorCard() {
    showErrorCard = true;
  }

  async function loadProject(projectGUID: any) {
    
    try {
      
      const requestParams = {
        url: `/app/projects/${projectGUID}`,
        setshowErrorCard,
      };
      const project = await apiRequest(requestParams);
      console.log("try called",project);

      if (project.data) {
        projectDetails = project.data;
      }
    } catch (err) {
      loadselectedProjects();
      donationStep = 0;
    }
  }

  async function loadselectedProjects() {
    try {
      const requestParams = {
        url: `/app/projects?_scope=map`,
        setshowErrorCard,
      };
      const projects: any = await apiRequest(requestParams);
      if (projects.data) {
        let allowedDonationsProjects = projects.data.filter(
          (project: { properties: { allowDonations: boolean } }) =>
            project.properties.allowDonations === true
        );

        allProjects = allowedDonationsProjects;
        const featuredProjects = getFilteredProjects(
          allowedDonationsProjects,
          "featured"
        );
        if (featuredProjects?.length < 6) {
          allProjects = featuredProjects;
        } else {
          const randomProjects = getRandomProjects(featuredProjects, 6);
          allProjects = randomProjects;
        }
      }
    } catch (err) {
      // console.log(err);
    }
  }

  if (context.query.to && !context.query.context) {
    
    loadProject(context.query.to);
    donationStep = 1;
  } else {
    if (!context.query.context) {
      loadselectedProjects();
      donationStep = 0;
    }
  }
  console.log("projectDetails", projectDetails);
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
      allProjects: allProjects,
    }, // will be passed to the page component as props
  };
}
