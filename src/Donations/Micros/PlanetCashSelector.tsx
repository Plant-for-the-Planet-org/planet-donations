import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
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
  const router = useRouter();

  useEffect(() => {
    // Here checking country is important as many countries could have same currency.

    if (
      country === profile!.planetCash.country &&
      paymentSetup.unitCost * quantity >
        profile!.planetCash.balance / 100 +
          profile!.planetCash.creditLimit / 100
    ) {
      setIsPlanetCashActive(false);
    }
  }, [paymentSetup.unitCost, quantity, setIsPlanetCashActive]);

  useEffect(() => {
    // This is done to lock the transaction with PlanetCash in a single currency.
    // Here setting country is important as many countries could have same currency.

    // Setting country in global context changes currency of the selected country.
    if (isPlanetCashActive) {
      setcountry(profile!.planetCash.country);
    }
  }, [isPlanetCashActive, setcountry]);

  useEffect(() => {
    // Donation with PlanetCash is a one time process.
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

  const handleAddBalance = () => {
    router.replace({
      query: { ...router.query, to: profile!.planetCash.account },
    });
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
          <button
            className="add-plant-cash-balance"
            onClick={() => {
              setIsPlanetCashActive(false);
              handleAddBalance();
            }}
          >
            {t("addBalance")}
          </button>
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
