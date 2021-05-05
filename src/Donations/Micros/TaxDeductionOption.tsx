import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import DownArrowIcon from "../../../public/assets/icons/DownArrowIcon";
import themeProperties from "../../../styles/themeProperties";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import TaxDeductionCountryModal from "./TaxDeductionCountryModal";

interface Props {}

function TaxDeductionOption({}: Props): ReactElement {
  const { t } = useTranslation(["common"]);

  const { projectDetails, country, setIsTaxDeductible } = React.useContext(
    QueryParamContext
  );
  const [openTaxDeductionModal, setopenTaxDeductionModal] = React.useState(
    false
  );

  React.useEffect(() => {
    if (
      projectDetails &&
      projectDetails.taxDeductionCountries &&
      projectDetails.taxDeductionCountries.includes(country)
    ) {
      setIsTaxDeductible(true);
    } else {
      setIsTaxDeductible(false);
    }
  }, [country]);

  return projectDetails ? (
    <div className="mt-30">
      {projectDetails.taxDeductionCountries &&
      projectDetails.taxDeductionCountries.length > 0 ? (
        <div className={"d-inline"}>
          {projectDetails.taxDeductionCountries.includes(country)
            ? t("youWillReceiveTaxDeduction")
            : t("taxDeductionNotYetAvailable")}
          <button
            onClick={() => setopenTaxDeductionModal(true)}
            className={"tax-country-selection text-primary text-bold"}
          >
            {t(`country:${country.toLowerCase()}`)}
            <DownArrowIcon color={themeProperties.primaryColor} />
          </button>
          {projectDetails &&
          projectDetails.taxDeductionCountries.includes(country)
            ? t("inTimeOfTaxReturns")
            : null}
        </div>
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
