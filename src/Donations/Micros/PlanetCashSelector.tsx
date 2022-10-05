import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useContext, useEffect, useState } from "react";
import ToggleSwitch from "src/Common/InputTypes/ToggleSwitch";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { getCountryDataBy } from "src/Utils/countryUtils";
import getFormatedCurrency from "src/Utils/getFormattedCurrency";
import countriesData from "../../Utils/countriesData.json";

// TODO - Sentry captureException;

const PlanetCashSelector: FC = (props) => {
  const { t, i18n } = useTranslation("common");
  const {
    profile,
    isPlanetCashActive,
    setIsPlanetCashActive,
    paymentSetup,
    quantity,
    country,
    setcountry,
    frequency,
    paymentRequest,
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
    // On Load If selected country is planetCash Country and balance is sufficient activate planetCash.

    if (
      country === profile!.planetCash.country &&
      paymentSetup.unitCost * quantity <=
        profile!.planetCash.balance / 100 +
          profile!.planetCash.creditLimit / 100
    ) {
      setIsPlanetCashActive(true);
    }
    if (frequency !== "once") {
      setIsPlanetCashActive(false);
    }
  }, [paymentRequest, frequency]);

  useEffect(() => {
    // This is done to lock the transaction with PlanetCash in a single currency.
    // Here setting country is important as many countries could have same currency.

    // Setting country in global context changes currency of the selected country.
    if (isPlanetCashActive) {
      setcountry(profile!.planetCash.country);
    }
  }, [isPlanetCashActive, setcountry]);
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
      return t("lowBalanceAndOneTimePay");
    } else if (lowBalance) {
      return t("lowBalance");
    } else {
      return t("oneTimePay");
    }
  };

  const handleAddBalance = () => {
    router.replace({
      query: { ...router.query, to: "planetCash" },
    });
  };

  const CountryData = getCountryDataBy("countryCode", country);

  return (
    <div className="planet-cash-selector">
      <div className="planet-cash-selector-toggle">
        <div>
          <p>{t("usePlanetCash")}</p>
          {isPlanetCashActive ? (
            <>
              <br />
              <span>
                {CountryData?.countryName} / {profile?.planetCash.currency}
              </span>
              <p>
                {t("balance")}&nbsp;
                <span
                  className={
                    "planet-cash-balance" +
                    (Math.sign(profile!.planetCash.balance / 100) !== -1
                      ? "-positive"
                      : "-negative")
                  }
                >
                  {getFormatedCurrency(
                    i18n.language,
                    profile!.planetCash.currency,
                    profile!.planetCash.balance / 100
                  )}
                </span>
              </p>
              {profile!.planetCash.creditLimit !== null &&
                profile!.planetCash.creditLimit !== 0 && (
                  <p>
                    {t("credit")}&nbsp;
                    <span
                      className={
                        "planet-cash-balance" +
                        (Math.sign(profile!.planetCash.creditLimit / 100) !== -1
                          ? "-positive"
                          : "-negative")
                      }
                    >
                      {getFormatedCurrency(
                        i18n.language,
                        profile!.planetCash.currency,
                        profile!.planetCash.creditLimit / 100
                      )}
                    </span>
                  </p>
                )}
            </>
          ) : (
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
                {getFormatedCurrency(
                  i18n.language,
                  profile!.planetCash.currency,
                  profile!.planetCash.balance / 100 +
                    profile!.planetCash.creditLimit / 100
                )}
              </span>
            </p>
          )}

          {(isPlanetCashActive ||
            (country === profile!.planetCash.country &&
              paymentSetup.unitCost * quantity >
                profile!.planetCash.balance / 100 +
                  profile!.planetCash.creditLimit / 100)) && (
            <button
              className="add-plant-cash-balance"
              onClick={() => {
                setIsPlanetCashActive(false);
                handleAddBalance();
              }}
            >
              <p>{t("addBalance")}</p>
            </button>
          )}
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
