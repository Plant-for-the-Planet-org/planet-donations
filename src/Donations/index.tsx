import React, { ReactElement, useState } from "react";
import GiftForm from "./Components/GiftForm";
import ContactsForm from "./Components/ContactsForm";

import { QueryParamContext } from "../Layout/QueryParamContext";
import CustomIcon from "../../public/assets/icons/CustomIcon";
import PaymentsForm from "./Components/PaymentsForm";

interface Props {}

function Donations({}: Props): ReactElement {
  return (
    <div className="donations-container">
      <div className="donations-card-container">
        <div className="donations-info-container">
          <p className="title-text donations-project-name">
            Community-based restoration at El Silencio Natural Reserve
          </p>
          <div className="donations-info"></div>
          <div className="donations-transaction-details">
            <p>Transaction ID - 3343FDFD3434</p>
            <p>This donation is processed by Plant-for-the-Planet</p>
          </div>
        </div>
        <DonationsForm />
        {/* <ContactsForm/> */}
        {/* <PaymentsForm/> */}
      </div>
    </div>
  );
}


function DonationsForm() {
  const { isGift } = React.useContext(QueryParamContext);

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
            <TreeSelectionForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeSelectionForm() {

  const { treeSelectionOptions } = React.useContext(QueryParamContext);

  return (
    <div>
      <div className="tree-selection-options-container mt-20">
        {treeSelectionOptions.map((option, key) => {
          return (
            <div key={key} className="tree-selection-option">
              {option.iconFile}
              <div className="tree-selection-option-text">
                <p>{option.treeCount}</p>
                <span>trees</span>
              </div>
            </div>
          );
        })}

        <div className="tree-selection-option" style={{flexGrow:1, marginLeft:'30px'}}>
          <CustomIcon />
          <div className="tree-selection-option-text">
            <p style={{letterSpacing:'-2px'}}>_________________</p>
            <span>Custom trees</span>
          </div>
        </div>
      </div>
      <p>
        You will receive a tax deduction receipt for Germany in time for tax
        returns.
      </p>
      <button className="primary-button w-100 mt-30">Continue</button>
    </div>
  );
}

export default Donations;
