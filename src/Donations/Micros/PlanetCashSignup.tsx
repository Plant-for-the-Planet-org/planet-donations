import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import CountrySelect from "src/Common/InputTypes/AutoCompleteCountry";

const PlanetCashSignup = () => {
  const { t } = useTranslation(["common"]);

  const [country, setCountry] = useState("DE");

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
        <div className={"form-field mb-20"}>
          <CountrySelect
            allowedCountries={["DE", "ES", "US"]}
            label={t("country")}
            name="country"
            onChange={(e) => setCountry(e.target?.value)}
            defaultValue={country}
          />
        </div>
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
