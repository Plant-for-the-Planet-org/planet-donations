import React, { ReactElement } from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";

interface Props {}

function FrequencyOptions({}: Props): ReactElement {
  const { paymentSetup, setfrequency,frequency } = React.useContext(QueryParamContext);
  console.log("paymentSetup", paymentSetup);

  const customfrequencies = ["once","monthly","annually"];

  return (
    <div className="d-flex justify-content-between flex-wrap">
      {paymentSetup.frequencies && paymentSetup.frequencies.length > 0 ? (
        customfrequencies.map((frequencyOption:any, index:any) => {
          return (
            <div
              className={`tree-selection-option mt-20 ${
                frequencyOption === frequency
                  ? "tree-selection-option-selected"
                  : ""
              }`}
              onClick={
                  ()=>setfrequency(frequencyOption)
              }
            >
              {frequencyOption}
            </div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}

export default FrequencyOptions;
