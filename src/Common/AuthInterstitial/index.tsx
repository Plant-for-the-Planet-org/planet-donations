import { ReactElement, useContext } from "react";
import { useTranslation } from "next-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./AuthInterstitial.module.scss";
import LeftPanelContainer from "src/Donations/LeftPanel/LeftPanelContainer";
import { QueryParamContext } from "src/Layout/QueryParamContext";

const AuthInterstitial = (): ReactElement => {
  const { t } = useTranslation("common");
  const { tenant } = useContext(QueryParamContext);

  // TODO - refactor class names
  return (
    <div
      style={{ flexGrow: 1, backgroundColor: "var(--background-color-dark)" }}
      className="d-flex justify-content-center align-items-center"
    >
      <div className="donations-container">
        <div className="donations-card-container">
          {/* Left Panel (empty in this case) */}
          <LeftPanelContainer tenant={tenant} />
          {/* Right Panel */}
          <div
            className="right-panel-container"
            style={{ paddingBottom: "0px" }}
          >
            <div className="donations-form w-100">
              <div>
                <div className={styles.loaderContainer}>
                  <CircularProgress color="inherit" />
                  <p>{t("loading")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthInterstitial;
