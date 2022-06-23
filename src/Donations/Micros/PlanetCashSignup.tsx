import React, { useState, useEffect, useCallback, useContext } from "react";
import { useTranslation } from "next-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import CountrySelect from "src/Common/InputTypes/AutoCompleteCountry";
import { apiRequest } from "src/Utils/api";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";

interface PlanetCashAccount {
  id: string;
  ownerName: string;
  balance: number;
  debit: number;
  creditLimit: number;
  currency: string;
  country: string;
  topUpThreshold: number;
  topUpAmount: number;
  isActive: boolean;
  fee: number;
}

const usePlanetCashSignupStyles = makeStyles({
  rootContainer: {
    height: 500,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

const PlanetCashSignup = () => {
  const { t } = useTranslation(["common"]);
  const { getAccessTokenSilently } = useAuth0();
  const { setshowErrorCard } = useContext(QueryParamContext);
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [country, setCountry] = useState("DE");
  const [planetCashAccounts, setPlanetCashAccounts] = useState<
    PlanetCashAccount[]
  >([]);
  const [currentPlanetCashAccount, setCurrentPlanetCashAccount] =
    useState<PlanetCashAccount | null>(null);

  const classes = usePlanetCashSignupStyles();

  const fetchPlanetCashAccounts = useCallback(async () => {
    const token = await getAccessTokenSilently();
    try {
      setLoading(true);
      const options = {
        url: "/app/planetCash",
        token,
        setshowErrorCard,
      };
      const { data } = await apiRequest(options);
      setPlanetCashAccounts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [apiRequest, getAccessTokenSilently]);

  useEffect(() => {
    fetchPlanetCashAccounts();
  }, [fetchPlanetCashAccounts]);

  useEffect(() => {
    const _planetCashAccount = planetCashAccounts.find(
      (planetCashAccount) =>
        planetCashAccount.country.toLowerCase() === country.toLowerCase()
    );

    if (_planetCashAccount) {
      setCurrentPlanetCashAccount(_planetCashAccount);
    } else {
      setCurrentPlanetCashAccount(null);
    }
  }, [country, planetCashAccounts]);

  const onChangeCountry = (_country: string) => {
    setCountry(_country);
    const _currentPlanetCashAccount = planetCashAccounts.find((account) => {
      return account.country === _country;
    });
    if (_currentPlanetCashAccount) {
      setCurrentPlanetCashAccount(_currentPlanetCashAccount);
    } else setCurrentPlanetCashAccount(null);
  };

  const handleActivatePlanetCashAccount = useCallback(async () => {
    if (currentPlanetCashAccount) {
      const token = await getAccessTokenSilently();
      try {
        const options = {
          method: "POST",
          url: `/app/planetCash/${currentPlanetCashAccount.id}/activate`,
          token,
          setshowErrorCard,
        };
        await apiRequest(options);
        router.reload();
      } catch (err) {
        console.error(err);
      }
    }
  }, [currentPlanetCashAccount]);

  const handleCreatePlanetCashAccount = async () => {
    const token = await getAccessTokenSilently();
    try {
      const options = {
        method: "POST",
        url: "/app/planetCash",
        token,
        data: {
          country,
          activate: true,
        },
        setshowErrorCard,
      };
      await apiRequest(options);
      router.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={classes.rootContainer}>
      <div>
        {!loading && currentPlanetCashAccount ? (
          <p className="title-text mb-20">{t("activatePlanetCash")}</p>
        ) : (
          <p className="title-text mb-20">{t("planetCashSignup")}</p>
        )}

        {!loading && currentPlanetCashAccount ? (
          <p className="mb-20">
            {t("activatePlanetCashMsg", {
              currency: currentPlanetCashAccount.currency,
            })}
          </p>
        ) : (
          <p className="mb-20">{t("noPlanetCashAccount")}</p>
        )}

        <div className={"form-field mb-20"}>
          <CountrySelect
            allowedCountries={["DE", "ES", "US", "CZ"]}
            label={t("country")}
            name="country"
            onChange={onChangeCountry}
            defaultValue={country}
          />
        </div>
        <p className="mb-20">{t("planetCashTC")}</p>
        <p>{t("planetCashIUnderstand")}</p>
      </div>
      {!loading && currentPlanetCashAccount ? (
        <button
          onClick={handleActivatePlanetCashAccount}
          className="primary-button w-100 mt-30"
        >
          {t("activatePlanetCash")}
        </button>
      ) : (
        <button
          onClick={handleCreatePlanetCashAccount}
          className="primary-button w-100 mt-30"
        >
          {t("createPlanetCashAccount")}
        </button>
      )}
    </div>
  );
};

export default PlanetCashSignup;
