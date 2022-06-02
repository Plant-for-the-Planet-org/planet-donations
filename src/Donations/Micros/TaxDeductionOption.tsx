import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import DownArrowIcon from "../../../public/assets/icons/DownArrowIcon";
import themeProperties from "../../../styles/themeProperties";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import TaxDeductionCountryModal from "./TaxDeductionCountryModal";

interface Props {}

function TaxDeductionOption({}: Props): ReactElement {
  const { t } = useTranslation(["common"]);

  const {
    projectDetails,
    country,
    setIsTaxDeductible,
    allowTaxDeductionChange,
    isTaxDeductible,
  } = React.useContext(QueryParamContext);
  const [openTaxDeductionModal, setopenTaxDeductionModal] =
    React.useState(false);

  React.useEffect(() => {
    if (
      projectDetails &&
      projectDetails.taxDeductionCountries &&
      projectDetails?.taxDeductionCountries?.includes(country)
    ) {
      setIsTaxDeductible(true);
    } else {
      setIsTaxDeductible(false);
    }
  }, [projectDetails, country]);

  return projectDetails ? (
    <div className="mt-20">
      {projectDetails.taxDeductionCountries &&
      projectDetails.taxDeductionCountries.length > 0 ? (
        allowTaxDeductionChange ? (
          <div className={"d-inline"}>
            {projectDetails?.taxDeductionCountries?.includes(country)
              ? t("youWillReceiveTaxDeduction")
              : t("taxDeductionNotYetAvailable")}
            <button
              onClick={() => {
                // if the purpose is planet-cash (i.e Top-up PlanetCash) then lock the currency and country for transaction.
                // since transaction needs to happen in the same currency.

                projectDetails?.purpose !== "planet-cash" &&
                  setopenTaxDeductionModal(true);
              }}
              className={"tax-country-selection text-primary text-bold"}
              data-test-id="taxCountrySelection"
            >
              {t(`country:${country?.toLowerCase()}`)}
              {projectDetails?.purpose !== "planet-cash" && (
                <DownArrowIcon color={themeProperties.primaryColor} />
              )}
            </button>
            &nbsp;
            {projectDetails?.taxDeductionCountries?.includes(country)
              ? t("inTimeOfTaxReturns")
              : null}
          </div>
        ) : isTaxDeductible ? (
          <div className={"d-inline"}>
            {projectDetails?.taxDeductionCountries?.includes(country)
              ? t("youWillReceiveTaxDeduction")
              : t("taxDeductionNotYetAvailable")}
            <div className={"tax-country-selection text-primary text-bold"}>
              {t(`country:${country?.toLowerCase()}`)}
            </div>{" "}
            {projectDetails?.taxDeductionCountries?.includes(country)
              ? t("inTimeOfTaxReturns")
              : null}
          </div>
        ) : (
          <></>
        )
      ) : (
        <div className={"isTaxDeductible"}>
          {t("taxDeductionNotAvailableForProject")}
        </div>
      )}
      <TaxDeductionCountryModal
        openModal={openTaxDeductionModal}
        handleModalClose={() => setopenTaxDeductionModal(false)}
        taxDeductionCountries={projectDetails.taxDeductionCountries}
      />
    </div>
  ) : (
    <></>
  );
}

export default TaxDeductionOption;
