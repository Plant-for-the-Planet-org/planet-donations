import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Modal from "@mui/material/Modal";
import RadioGroup from "@mui/material/RadioGroup";
import React, { useState, ReactElement, ChangeEvent } from "react";
import { getCountryDataBy } from "../../Utils/countryUtils";
import { ThemeContext } from "../../../styles/themeContext";
import GreenRadio from "../../Common/InputTypes/GreenRadio";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import { Country } from "src/Common/Types";

interface TaxDeductionCountryModalProps {
  openModal: boolean;
  handleModalClose: () => void;
  taxDeductionCountries?: string[];
}

export default function TaxDeductionCountryModal({
  openModal,
  handleModalClose,
  taxDeductionCountries,
}: TaxDeductionCountryModalProps): ReactElement | null {
  const { setcountry, country, currency } = React.useContext(QueryParamContext);

  const { t, ready } = useTranslation("common");

  const [countriesData, setCountriesData] = useState<Country[]>([]);

  const { theme } = React.useContext(ThemeContext);

  // changes the currency in when a currency is selected
  const handleCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedData = event.target.value.split(",");
    setcountry(selectedData[0]);
    localStorage.setItem("countryCode", selectedData[0]);
    handleModalClose();
  };

  React.useEffect(() => {
    let tempCountriesData: Country[] = [];
    if (taxDeductionCountries && taxDeductionCountries.length > 0) {
      taxDeductionCountries.forEach((countryCode: string) => {
        const countryData = getCountryDataBy("countryCode", countryCode);
        if (countryData) {
          tempCountriesData.push(countryData);
        }
      });
      tempCountriesData = tempCountriesData.sort(function (a, b) {
        const countryA = t(`country:${a.countryCode.toLowerCase()}`);
        const countryB = t(`country:${b.countryCode.toLowerCase()}`);
        return countryA < countryB ? -1 : countryA > countryB ? 1 : 0;
      });
      setCountriesData(tempCountriesData);
    }
  }, [t]);

  return ready ? (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modal-container " + theme}
      open={openModal}
      onClose={handleModalClose}
      closeAfterTransition
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={openModal}>
        <div className={"modal p-20"}>
          <div className={"radioButtonsContainer"}>
            <p className={"select-language-title"}>{t("selectCountry")}</p>
            {/* maps the radio button for country */}
            <FormControl component="fieldset" variant="standard">
              <RadioGroup
                aria-label="language"
                name="language"
                value={`${country},${currency}`}
                onChange={handleCountryChange}
              >
                {countriesData.map((country, index) => (
                  <FormControlLabel
                    key={country.countryCode + "-" + index}
                    value={`${country.countryCode},${country.currencyCode}`} // need both info
                    control={<GreenRadio />}
                    label={
                      t("country:" + country.countryCode.toLowerCase()) +
                      " · " +
                      country.currencyCode
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </Fade>
    </Modal>
  ) : null;
}
