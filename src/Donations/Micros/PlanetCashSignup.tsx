import React from "react";
import { useTranslation } from "next-i18next";

const PlanetCashSignup = () => {
  const { t } = useTranslation(["common"]);
  return (
    <div
      style={{
        height: 500,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <p className="title-text mb-20">{t("planetCashSignup")}</p>
        <p className="mb-20">{t("noPlanetCashAccount")}</p>
        <p className="mb-20">{t("planetCashTC")}</p>
        <p>{t("planetCashIUnderstand")}</p>
      </div>
      <button className="primary-button w-100 mt-30">
        {t("createPlanetCashAccount")}
      </button>
    </div>
  );
};

export default PlanetCashSignup;
