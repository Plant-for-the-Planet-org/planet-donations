import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Modal from "@material-ui/core/Modal";
import RadioGroup from "@material-ui/core/RadioGroup";
import React, { useState } from "react";
import { getCountryDataBy } from "../../Utils/countryUtils";
import { ThemeContext } from "../../../styles/themeContext";
import GreenRadio from "../../Common/InputTypes/GreenRadio";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../Layout/QueryParamContext";

export default function TaxDeductionCountryModal(props: any) {
  const { openModal, handleModalClose, taxDeductionCountries } = props;

  const { setcountry, country, setcurrency, currency } =
    React.useContext(QueryParamContext);

  const { t, ready } = useTranslation("common");

  const [countriesData, setCountriesData] = useState([]);

  const { theme } = React.useContext(ThemeContext);

  // changes the currency in when a currency is selected
  const handleCountryChange = (event: any) => {
    const selectedData = event.target.value.split(",");
    setcountry(selectedData[0]);
    localStorage.setItem("countryCode", selectedData[0]);

    // Not needed as new payment setup will be fetched
    // setcurrency(selectedData[1]);
    handleModalClose();
  };

  React.useEffect(() => {
    let tempCountriesData: any = [];
    if (taxDeductionCountries && taxDeductionCountries.length > 0) {
      taxDeductionCountries.forEach((countryCode: string) => {
        tempCountriesData.push(getCountryDataBy("countryCode", countryCode));
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
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <div className={"modal p-20"}>
          <div className={"radioButtonsContainer"}>
            <p className={"select-language-title"}>{t("selectCountry")}</p>
            {/* maps the radio button for country */}
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="language"
                name="language"
                value={`${country},${currency}`}
                onChange={handleCountryChange}
              >
                {countriesData.map((country: any, index: number) => (
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
