import { useTranslation } from "next-i18next";
import { FC, useContext, useEffect } from "react";
import ToggleSwitch from "src/Common/InputTypes/ToggleSwitch";
import { QueryParamContext } from "src/Layout/QueryParamContext";

// TODO - Sentry captureException;

const PlanetCashSelector: FC = (props) => {
  const { t } = useTranslation("common");
  const {
    profile,
    isPlanetCashActive,
    setIsPlanetCashActive,
    paymentSetup,
    quantity,
    country,
    setcountry,
    frequency,
  } = useContext(QueryParamContext);

  useEffect(() => {
    if (
      country === profile!.planetCash.country &&
      paymentSetup.unitCost * quantity >
        profile!.planetCash.balance / 100 +
          profile!.planetCash.creditLimit / 100
    ) {
      setIsPlanetCashActive(false);
    }
  }, [paymentSetup.unitCost, quantity]);

  useEffect(() => {
    if (isPlanetCashActive) {
      setcountry(profile!.planetCash.country);
    }
  }, [isPlanetCashActive, setcountry]);

  useEffect(() => {
    if (frequency !== "once") {
      setIsPlanetCashActive(false);
    }
  }, [frequency]);

  const shouldPlanetCashDisable = () => {
    let lowBalance = false;
    let isOnce = false;

    if (
      country === profile!.planetCash.country &&
      paymentSetup.unitCost * quantity >
        profile!.planetCash.balance / 100 +
          profile!.planetCash.creditLimit / 100
    ) {
      lowBalance = true;
    }

    // Donation with PlanetCash is a one time payment
    if (frequency === "once") {
      isOnce = true;
    }

    return lowBalance || !isOnce;
  };

  const disabledReason = () => {
    let lowBalance = false;
    let isOnce = false;

    if (
      country === profile!.planetCash.country &&
      paymentSetup.unitCost * quantity >
        profile!.planetCash.balance / 100 +
          profile!.planetCash.creditLimit / 100
    ) {
      lowBalance = true;
    }

    if (frequency === "once") {
      isOnce = true;
    }

    if (lowBalance && !isOnce) {
      return "Balance is low | Donation with PlanetCash is a one time payment";
    } else if (lowBalance) {
      return "Balance is low";
    } else {
      return "Donation with PlanetCash is a one time payment";
    }
  };

  return (
    <div className="planet-cash-selector">
      <div className="planet-cash-selector-toggle">
        <div>
          <p>{t("usePlanetCash")}</p>
          <p>
            {t("balance")}&nbsp;
            <span
              className={
                "planet-cash-balance" +
                (Math.sign(
                  profile!.planetCash.balance / 100 +
                    profile!.planetCash.creditLimit / 100
                ) !== -1
                  ? "-positive"
                  : "-negative")
              }
            >
              {(
                profile!.planetCash.balance / 100 +
                profile!.planetCash.creditLimit / 100
              ).toFixed(2)}{" "}
              {profile!.planetCash.currency}
            </span>
          </p>
          <p className="add-plant-cash-balance">{t("addBalance")}</p>
        </div>
        <div title={disabledReason() ? disabledReason() : ""}>
          <ToggleSwitch
            checked={isPlanetCashActive}
            disabled={shouldPlanetCashDisable()}
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
