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
import { useTranslation } from "react-i18next";
import { QueryParamContext } from "../../Layout/QueryParamContext";

export default function TaxDeductionCountryModal(props: any) {
  const {
    openModal,
    handleModalClose,
    taxDeductionCountries,
  } = props;

  const {
    setcountry,
    country,
    setcurrency,
    currency,
  } = React.useContext(QueryParamContext);  

  const { t, ready } = useTranslation("common");

  const [countriesData, setCountriesData] = useState([]);
  const [selectedModalValue, setSelectedModalValue] = useState(
    `${country},${currency}`
  );

  const { theme } = React.useContext(ThemeContext);

  // changes the currency in when a currency is selected
  const handleCountryChange = (event: any) => {
    setSelectedModalValue(event.target.value);
  };

  // changes the language and currency code in footer state and local storage
  // when user clicks on OK
  function handleOKClick() {
    const selectedData = selectedModalValue.split(",");
    setcountry(selectedData[0]);
    setcurrency(selectedData[1]);
    handleModalClose();
  }

  React.useEffect(() => {
    setSelectedModalValue(`${country},${currency}`);
  }, [country, currency]);

  React.useEffect(() => {
    const tempCountriesData: any = [];
    taxDeductionCountries.forEach((countryCode: string) =>
      tempCountriesData.push(getCountryDataBy("countryCode", countryCode))
    );
    setCountriesData(tempCountriesData);
  }, []);

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
        <div className={'modal p-20'}>
          <div className={'radioButtonsContainer'}>
            <p className={'select-language-title'}>{t("selectCountry")}</p>
            {/* maps the radio button for country */}
            <MapCountry
              countriesData={countriesData}
              // this is selectedValue,
              value={selectedModalValue}
              handleChange={handleCountryChange}
            />
          </div>

          {/* modal buttons */}
          <div className={'mt-20 d-flex row justify-content-between'}>
            <button
              id={"selectTaxDedCan"}
              className={'secondary-button'}
              style={{minWidth:'130px',width:'130px'}}
              onClick={handleModalClose}
            >
              <p>{t("cancel")}</p>
            </button>
            <button
              id={"selectTaxDedOk"}
              className={'primary-button'}
              style={{minWidth:'130px',width:'130px'}}
              onClick={handleOKClick}
            >
              <p>{t("selectCountry")}</p>
            </button>
          </div>
        </div>
      </Fade>
    </Modal>
  ) : null;
}

// Maps the radio buttons for currency
function MapCountry(props: any) {
  const { t, ready } = useTranslation(["country"]);

  const { countriesData, value, handleChange } = props;
  return ready ? (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="language"
        name="language"
        value={value}
        onChange={handleChange}
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
  ) : null;
}
