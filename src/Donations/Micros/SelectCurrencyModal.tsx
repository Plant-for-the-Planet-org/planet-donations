import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import Modal from "@mui/material/Modal";
import Autocomplete from "@mui/material/Autocomplete";
import Paper, { PaperProps } from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { ThemeContext } from "../../../styles/themeContext";
import MaterialTextField from "../../Common/InputTypes/MaterialTextField";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import {
  getCountryDataBy,
  sortCountriesByTranslation,
} from "../../Utils/countryUtils";
import themeProperties from "../../../styles/themeProperties";
import { Country, CurrencyList } from "src/Common/Types";

interface SelectCurrencyModalProps {
  openModal: boolean;
  handleModalClose: () => void;
}

export default function SelectCurrencyModal({
  openModal,
  handleModalClose,
}: SelectCurrencyModalProps): ReactElement | null {
  const { setcountry, country, currency, enabledCurrencies } =
    useContext(QueryParamContext);

  const { t, ready } = useTranslation(["common", "country"]);

  const { theme } = useContext(ThemeContext);

  const [importantList, setImportantList] = useState<Array<string>>([]);

  useEffect(() => {
    // sets two default country as important country which is US(United States) and DE (Germany)
    const impCountryList = ["US", "DE"];
    // if the selected country is other than US and DE then add that country to important country list
    if (country && country != "US" && country != "DE") {
      impCountryList.push(country);
    }
    // adds the important country list to state
    setImportantList(impCountryList);
  }, [currency]);

  return ready ? (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={"modal-container" + " " + theme}
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={openModal}>
          <div className={"modal p-20"}>
            <div className={"radioButtonsContainer"}>
              <p className={"select-language-title"}>{t("selectCurrency")}</p>
              <MapCurrency
                // this is selectedValue, country wala object
                enabledCurrencies={enabledCurrencies}
                priorityCountries={importantList}
                value={country}
                handleChange={(value: Country) => {
                  setcountry(value.countryCode);
                  // setcurrency
                  localStorage.setItem("countryCode", value.countryCode);
                  handleModalClose();
                }}
              />
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  ) : null;
}

const FormControlNew = styled(FormControl)({
  width: "100%",
});

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
}

interface MapCurrencyProps {
  enabledCurrencies: CurrencyList | null;
  priorityCountries: string[];
  value: string;
  handleChange: (value: Country) => void;
}

// Shows autocomplete options for currency
function MapCurrency({
  enabledCurrencies,
  priorityCountries,
  value,
  handleChange,
}: MapCurrencyProps) {
  const { t, i18n, ready } = useTranslation(["country"]);

  const { theme } = useContext(ThemeContext);

  const StyledAutoCompletePaper = styled(Paper)({
    color:
      theme === "theme-light"
        ? themeProperties.light.primaryFontColor
        : themeProperties.dark.primaryFontColor,
    backgroundColor:
      theme === "theme-light"
        ? themeProperties.light.backgroundColor
        : themeProperties.dark.backgroundColor,
  });

  const CustomPaper = (props: PaperProps) => (
    <StyledAutoCompletePaper {...props} />
  );

  const StyledAutocompleteOption = styled("li")({
    fontFamily: themeProperties.fontFamily,
    fontSize: "14px",
    "&:hover": {
      backgroundColor:
        theme === "theme-light"
          ? themeProperties.light.backgroundColorDark
          : themeProperties.dark.backgroundColorDark,
    },
    "&:active": {
      backgroundColor:
        theme === "theme-light"
          ? themeProperties.light.backgroundColorDark
          : themeProperties.dark.backgroundColorDark,
    },
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  });

  const sortedCountriesData = ready
    ? sortCountriesByTranslation(
        t,
        i18n.language,
        priorityCountries,
        enabledCurrencies
      )
    : {};

  const selectedCountry = getCountryDataBy("countryCode", value);

  return ready ? (
    <FormControlNew variant="standard">
      {sortedCountriesData && (
        <div className={"form-field mt-20"}>
          <Autocomplete
            data-test-id="country-select"
            style={{ width: "100%" }}
            options={sortedCountriesData as Country[]}
            PaperComponent={CustomPaper}
            value={selectedCountry}
            autoHighlight
            getOptionLabel={(option) =>
              `${t(`country:${option.countryCode.toLowerCase()}`)} - ${
                option.currencyCode
              } `
            }
            renderOption={(props, option) => (
              <StyledAutocompleteOption {...props}>
                <span>{countryToFlag(option.countryCode)}</span>
                {`${t(`country:${option.countryCode.toLowerCase()}`)} - ${
                  option.currencyCode
                } `}
              </StyledAutocompleteOption>
            )}
            onChange={(_event, newValue: Country | null) => {
              if (newValue) {
                handleChange(newValue);
              }
            }}
            renderInput={(params) => (
              <MaterialTextField
                {...params}
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
                name={"countrydropdown"}
              />
            )}
          />
        </div>
      )}
    </FormControlNew>
  ) : null;
}
