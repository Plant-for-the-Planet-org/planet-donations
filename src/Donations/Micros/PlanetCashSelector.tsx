import { useTranslation } from "next-i18next";
import { FC, useContext, useEffect } from "react";
import ToggleSwitch from "src/Common/InputTypes/ToggleSwitch";
import { QueryParamContext } from "src/Layout/QueryParamContext";

// TODO - Sentry captureException;

const PlanetCashSelector: FC = (props) => {
  const { t } = useTranslation("common");
  const {
    profile,
    currency,
    isPlanetCashActive,
    setIsPlanetCashActive,
    paymentSetup,
    quantity,
    country,
    setcountry,
  } = useContext(QueryParamContext);

  useEffect(() => {
    if (
      country === profile!.planetCash.country &&
      paymentSetup.unitCost * quantity >
        profile!.planetCash.balance / 100 +
          profile!.planetCash.creditLimit / 100
    ) {
      setIsPlanetCashActive(false);
    } else {
      setIsPlanetCashActive(true);
    }
  }, [paymentSetup.unitCost, quantity]);

  useEffect(() => {
    if (isPlanetCashActive) {
      setcountry(profile!.planetCash.country);
    }
  }, [isPlanetCashActive, setcountry]);

  return (
    <div className="planet-cash-selector">
      <div className="planet-cash-selector-toggle">
        <div>
          <p>{t("usePlanetCash")}</p>
          <p>
            {t("balance")} &nbsp;
            <span
              className={
                "planet-cash-balance" +
                (Math.sign(profile!.planetCash.balance) !== -1
                  ? "-positive"
                  : "-negative")
              }
            >
              {profile!.planetCash.balance / 100} {profile!.planetCash.currency}
            </span>
            &nbsp;&bull;&nbsp;{t("credit")}{" "}
            <span className="planet-cash-credit-limit">
              {profile!.planetCash.creditLimit / 100}{" "}
              {profile!.planetCash.currency}
            </span>
          </p>
          <p className="add-plant-cash-balance">{t("addBalance")}</p>
        </div>
        <div
          title={
            country === profile!.planetCash.country &&
            (paymentSetup.unitCost * quantity >
            profile!.planetCash.balance / 100 +
              profile!.planetCash.creditLimit / 100
              ? "Balance too low"
              : "")
          }
        >
          <ToggleSwitch
            checked={isPlanetCashActive}
            disabled={
              country === profile!.planetCash.country &&
              paymentSetup.unitCost * quantity >
                profile!.planetCash.balance / 100 +
                  profile!.planetCash.creditLimit / 100
            }
            onChange={() =>
              setIsPlanetCashActive((isPlanetCashActive) => !isPlanetCashActive)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PlanetCashSelector;
