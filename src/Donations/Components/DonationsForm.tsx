import React, { ReactElement } from "react";
import CustomIcon from "../../../public/assets/icons/CustomIcon";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import GiftForm from "./GiftForm";

interface Props {}

function DonationsForm() {
  const {
    isGift,
    treeSelectionOptions,
    setdonationStep,
    treeCount,
    settreeCount,
  } = React.useContext(QueryParamContext);

  return (
    <div className="donations-forms-container">
      <div className="donations-form">
        <button className="login-continue">Login & Continue</button>
        <div className="donations-tree-selection-step">
          <p className="title-text">Donate</p>
          <div className="donations-gift-container">
            <GiftForm />
          </div>
          <div
            className={`donations-tree-selection ${
              isGift ? "display-none" : ""
            }`}
          >
            <div className="tree-selection-options-container mt-20">
              {treeSelectionOptions.map((option, key) => {
                return (
                  <div
                    onClick={() => settreeCount(option.treeCount)}
                    key={key}
                    className={`tree-selection-option ${
                      option.treeCount === treeCount
                        ? "tree-selection-option-selected"
                        : ""
                    }`}
                  >
                    {option.iconFile}
                    <div className="tree-selection-option-text">
                      <p>{option.treeCount}</p>
                      <span>trees</span>
                    </div>
                  </div>
                );
              })}

              <div
                className="tree-selection-option"
                style={{ flexGrow: 1, marginLeft: "30px" }}
              >
                <CustomIcon />
                <div className="tree-selection-option-text">
                  <p style={{ letterSpacing: "-2px" }}>_________________</p>
                  <span>Custom trees</span>
                </div>
              </div>
            </div>
            <p>
              You will receive a tax deduction receipt for Germany in time for
              tax returns.
            </p>
            <button
              onClick={() => setdonationStep(2)}
              className="primary-button w-100 mt-30"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationsForm;
