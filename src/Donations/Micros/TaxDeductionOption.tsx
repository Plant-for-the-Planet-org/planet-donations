import React, { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import DownArrowIcon from "../../../public/assets/icons/DownArrowIcon";
import themeProperties from "../../../styles/themeProperties";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import TaxDeductionCountryModal from "./TaxDeductionCountryModal";

interface Props {}

function TaxDeductionOption({}: Props): ReactElement {
  const { t } = useTranslation(["common"]);

  const { projectDetails, country } = React.useContext(QueryParamContext);
  const [openTaxDeductionModal, setopenTaxDeductionModal] = React.useState(
    false
  );
  return (
    <div className="mt-20">
      {projectDetails &&
      projectDetails.taxDeductionCountries &&
      projectDetails.taxDeductionCountries.length > 0 ? (
        <div className={"mt-20 d-inline"}>
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
  );
}

export default TaxDeductionOption;
