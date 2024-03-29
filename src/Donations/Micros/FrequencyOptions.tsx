import { useTranslation } from "next-i18next";
import React, { ReactElement } from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";

function FrequencyOptions(): ReactElement {
  const { paymentSetup, setfrequency, frequency } =
    React.useContext(QueryParamContext);
  const { t } = useTranslation(["common"]);

  const customfrequencies = paymentSetup
    ? Object.keys(paymentSetup.frequencies)
    : [];

  return (
    <div className="d-flex justify-content-between flex-wrap frequency-selection-container mt-20">
      {customfrequencies?.map((frequencyOption, index) => {
        return (
          <div
            className={`frequency-selection-option ${
              frequencyOption === frequency
                ? "frequency-selection-option-selected"
                : ""
            }`}
            key={index}
            onClick={() => {
              setfrequency(frequencyOption);
            }}
            data-test-id="frequency"
          >
            {t(frequencyOption)}
          </div>
        );
      })}
    </div>
  );
}

export default FrequencyOptions;
