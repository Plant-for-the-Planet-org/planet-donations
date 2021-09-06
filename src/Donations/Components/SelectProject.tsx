import React, { ReactElement } from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import { useTranslation } from "next-i18next";
import getImageUrl from "../../Utils/getImageURL";
import { getCountryDataBy } from "../../Utils/countryUtils";
import {
  getFilteredProjects,
  getRandomProjects,
  getSearchProjects,
} from "../../Utils/projects/filterProjects";
import { useDebouncedEffect } from "../../Utils/useDebouncedEffect";
import NotFound from "./../../../public/assets/icons/NotFound";
import { useRouter } from "next/router";
import SearchIcon from "../../../public/assets/icons/SearchIcon";
import themeProperties from "../../../styles/themeProperties";

interface Props {}

function SelectProject({}: Props): ReactElement {
  const { selectedProjects, allProjects, setSelectedProjects, setprojectDetails } =
    React.useContext(QueryParamContext);
  const { t, i18n } = useTranslation(["common", "country"]);

  const [searchValue, setSearchValue] = React.useState("");
  const [trottledSearchValue, setTrottledSearchValue] = React.useState("");

  React.useEffect(() => {
    setprojectDetails({});
  },[])

  useDebouncedEffect(
    () => {
      setTrottledSearchValue(searchValue);
    },
    1000,
    [searchValue]
  );

  const searchProjectResults = React.useMemo(
    () => getSearchProjects(allProjects, trottledSearchValue),
    [trottledSearchValue]
  );

  React.useEffect(() => {
    if (trottledSearchValue && searchProjectResults) {
      setSelectedProjects(searchProjectResults);
    } else if (!trottledSearchValue) {
      if (allProjects?.length < 6) {
        setSelectedProjects(allProjects);
      } else {
        const randomProjects = getRandomProjects(allProjects, 6);
        setSelectedProjects(randomProjects);
      }
    }
  }, [searchProjectResults]);

  const router = useRouter();

  const donateToProject = (slug) => {
    router.push({ query: { ...router.query, to: slug, step: "donate" } });
  };

  return (selectedProjects && selectedProjects.length > 0) || searchValue ? (
    <div className="donations-forms-container column">
      <p className="title-text">{t("findProjects")}</p>
      <div className={"form-field mt-30 w-100"} style={{ alignSelf: "center" }}>
        <div className="project-search-input">
          <SearchIcon color={themeProperties.darkGrey} />
          <input
            type="text"
            value={searchValue}
            name="search"
            placeholder={t("search")}
            autoFocus
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {selectedProjects.length > 0 ? (
        <div className="project-container mt-30">
          {selectedProjects.map((project: any, index) => {
            return (
              <div
                onClick={() => donateToProject(project.properties.slug)}
                key={index}
                className="project"
              >
                {project.properties.tpo.image ? (
                  <img
                    className="project-organisation-image"
                    src={getImageUrl(
                      "profile",
                      "thumb",
                      project.properties.tpo.image
                    )}
                  />
                ) : (
                  <div className="project-organisation-image no-project-organisation-image">
                    {project.properties.tpo.name.charAt(0)}
                  </div>
                )}
                {project.properties.country && (
                  <p className="project-country">
                    {t(`country:${project.properties.country.toLowerCase()}`)}
                  </p>
                )}
                <p className="project-name">{project.properties.name}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={
            "w-100 d-flex column justify-content-center align-items-center"
          }
        >
          <NotFound className={"w-60 mt-30"} />
          <h5 className="mt-30">{t("noProjectsFound")}</h5>
        </div>
      )}
    </div>
  ) : (
    <div className="d-flex w-100 justify-content-center align-items-center">
      <span className="spinner"></span>
    </div>
  );
}

export default SelectProject;
