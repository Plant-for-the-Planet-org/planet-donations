import { ReactElement, useContext } from "react";
import { useTranslation } from "next-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./AuthInterstitial.module.scss";
import { getTenantBackground } from "src/Utils/getTenantBackground";
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
          {/* Left Panel */}
          <div
            style={{
              backgroundImage: `url(${getTenantBackground(tenant, null)})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            className="donations-info-container"
          >
            <div className="background-image-overlay"></div>
          </div>
          {/* Right Panel */}
          <div
            className="donations-forms-container"
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
