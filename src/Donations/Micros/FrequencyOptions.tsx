import React, { ReactElement } from "react";
import { QueryParamContext } from "../../Layout/QueryParamContext";

interface Props {}

function FrequencyOptions({}: Props): ReactElement {
  const { paymentSetup, setfrequency,frequency } = React.useContext(QueryParamContext);
  console.log("paymentSetup", paymentSetup);

  return (
    <div className="d-flex justify-content-between flex-wrap">
      {paymentSetup.frequencies && paymentSetup.frequencies.length > 0 ? (
        paymentSetup.frequencies.map((frequencyOption:any, index:any) => {
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
