import React, { ReactElement } from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";

interface Props {}

function FrequencyOptions({}: Props): ReactElement {
  const { paymentSetup, setfrequency, frequency } =
    React.useContext(QueryParamContext);

  const customfrequencies = ["once", "monthly", "yearly"];

  return (
    <div className="d-flex justify-content-between flex-wrap frequency-selection-container mt-20">
      {
        // paymentSetup.frequencies && paymentSetup.frequencies.length > 0 ? (
        customfrequencies.map((frequencyOption: any, index: any) => {
          return (
            <div
              className={`frequency-selection-option ${
                frequencyOption === frequency
                  ? "frequency-selection-option-selected"
                  : ""
              }`}
              key={index}
              onClick={() => setfrequency(frequencyOption)}
              data-test-id="frequency"
            >
              {frequencyOption}
            </div>
          );
        })
        // ) : (
        //   <></>
        // )
      }
    </div>
  );
}

export default FrequencyOptions;
