import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import Modal from "@material-ui/core/Modal";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { useTranslation } from "next-i18next";
import { ThemeContext } from "../../../styles/themeContext";
import MaterialTextField from "../../Common/InputTypes/MaterialTextField";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import {
  getCountryDataBy,
  sortCountriesByTranslation,
} from "../../Utils/countryUtils";
import themeProperties from "../../../styles/themeProperties";
export default function TransitionsModal(props: any) {
  const { openModal, handleModalClose } = props;

  const { setcountry, country, currency } = React.useContext(QueryParamContext);

  const { t, ready } = useTranslation(["common", "country"]);

  const { theme } = React.useContext(ThemeContext);

  const [importantList, setImportantList] = React.useState<Array<Object>>([]);

  React.useEffect(() => {
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
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={"modal p-20"}>
            <div className={"radioButtonsContainer"}>
              <p className={"select-language-title"}>{t("selectCurrency")}</p>
              <MapCurrency
                // this is selectedValue, country wala object
                priorityCountries={importantList}
                value={country}
                handleChange={(value) => {
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

const FormControlNew = withStyles({
  root: {
    width: "100%",
  },
})(FormControl);

interface CountryType {
  countryCode: string;
  label: string;
  currencyCode: string;
}

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

// Maps the radio buttons for currency
function MapCurrency(props: any) {
  const { t, i18n, ready } = useTranslation(["country"]);

  const { priorityCountries, value, handleChange } = props;

  const { theme } = React.useContext(ThemeContext);

  const useStylesAutoComplete = makeStyles({
    paper: {
      color:
        theme === "theme-light"
          ? themeProperties.light.primaryFontColor
          : themeProperties.dark.primaryFontColor,
      backgroundColor:
        theme === "theme-light"
          ? themeProperties.light.backgroundColor
          : themeProperties.dark.backgroundColor,
    },
    option: {
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
    },
  });
  const classes = useStylesAutoComplete();

  const sortedCountriesData = ready
    ? sortCountriesByTranslation(t, i18n.language, priorityCountries)
    : {};

  const selectedCountry = getCountryDataBy("countryCode", value);

  return ready ? (
    <FormControlNew>
      {sortedCountriesData && (
        <div className={"form-field mt-20"}>
          <Autocomplete
            data-test-id="country-select"
            style={{ width: "100%" }}
            options={sortedCountriesData as CountryType[]}
            classes={{
              option: classes.option,
              paper: classes.paper,
            }}
            value={selectedCountry}
            autoHighlight
            getOptionLabel={(option) =>
              `${t(`country:${option.countryCode.toLowerCase()}`)} - ${
                option.currencyCode
              } `
            }
            renderOption={(option) => (
              <>
                <span>{countryToFlag(option.countryCode)}</span>
                {`${t(`country:${option.countryCode.toLowerCase()}`)} - ${
                  option.currencyCode
                } `}
              </>
            )}
            onChange={(event: any, newValue: CountryType | null) => {
              if (newValue) {
                handleChange(newValue);
              }
            }}
            defaultValue={value.label}
            renderInput={(params) => (
              <MaterialTextField
                {...params}
                label={props.label}
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
