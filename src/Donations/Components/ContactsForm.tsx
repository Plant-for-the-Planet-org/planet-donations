import React, { ReactElement } from "react";
import MaterialTextField from "../../Common/InputTypes/MaterialTextField";
import AutoCompleteCountry from "../../Common/InputTypes/AutoCompleteCountry";
import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import ToggleSwitch from "../../Common/InputTypes/ToggleSwitch";
import COUNTRY_ADDRESS_POSTALS from "./../../Utils/countryZipCode";
import BackButton from "../../../public/assets/icons/BackButton";
import GeocoderArcGIS from "geocoder-arcgis";
import themeProperties from "../../../styles/themeProperties";
import { ThemeContext } from "../../../styles/themeContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import getFormatedCurrency from "src/Utils/getFormattedCurrency";

interface Props {}

function ContactsForm({}: Props): ReactElement {
  const { t, i18n } = useTranslation("common");

  React.useEffect(() => {
    setaddressSugggestions([]);
  }, []);

  const router = useRouter();
  const [isCompany, setIsCompany] = React.useState(false);
  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );
  const {
    contactDetails,
    setContactDetails,
    setdonationStep,
    country,
    isTaxDeductible,
    isSignedUp,
    currency,
    quantity,
    paymentSetup,
    frequency,
  } = React.useContext(QueryParamContext);

  const { user, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    if (contactDetails) {
      reset(contactDetails);
      if (contactDetails.companyName) {
        setIsCompany(true);
      }
    }
  }, [contactDetails]);

  const {
    register,
    errors,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
  } = useForm({
    mode: "all",
    defaultValues: {},
  });

  React.useEffect(() => {
    const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter(
      (country) => country.abbrev === contactDetails.country
    );
    setPostalRegex(fiteredCountry[0]?.postal);
  }, [contactDetails.country]);

  const onSubmit = (data: any) => {
    router.push({
      query: { ...router.query, step: "payment" },
    });
    setContactDetails({
      ...data,
      email: isAuthenticated ? contactDetails.email : data.email,
    });
    setdonationStep(3);
  };

  const [postalRegex, setPostalRegex] = React.useState(
    COUNTRY_ADDRESS_POSTALS.filter(
      (country) => country.abbrev === contactDetails.country
    )[0]?.postal
  );

  const changeCountry = (country: any) => {
    let data = getValues();
    data = {
      ...data,
      country,
    };
    setContactDetails(data);
  };

  const [addressSugggestions, setaddressSugggestions] = React.useState([]);

  const suggestAddress = (value) => {
    if (value.length > 3) {
      geocoder
        .suggest(value, {
          category: "Address",
          countryCode: contactDetails.country,
        })
        .then((result) => {
          const filterdSuggestions = result.suggestions.filter((suggestion) => {
            return !suggestion.isCollection;
          });
          setaddressSugggestions(filterdSuggestions);
        })
        .catch(console.log);
    }
  };

  const getAddress = (value) => {
    geocoder
      .findAddressCandidates(value, { outfields: "*" })
      .then((result) => {
        setValue("address", result.candidates[0].attributes.ShortLabel, {
          shouldValidate: true,
        });
        setValue("city", result.candidates[0].attributes.City, {
          shouldValidate: true,
        });
        setValue("zipCode", result.candidates[0].attributes.Postal, {
          shouldValidate: true,
        });
        setaddressSugggestions([]);
      })
      .catch(console.log);
  };

  const { theme } = React.useContext(ThemeContext);
  let suggestion_counter = 0;

  return (
    <div className={"donations-forms-container"}>
      <div className="donations-form">
        <div className="d-flex w-100 align-items-center">
          <button
            className="d-flex"
            onClick={() => {
              setdonationStep(1);
              router.push({
                query: { ...router.query, step: "donate" },
              });
            }}
            style={{ marginRight: "12px" }}
          >
            <BackButton
              color={
                theme === "theme-light"
                  ? themeProperties.light.primaryFontColor
                  : themeProperties.dark.primaryFontColor
              }
            />
          </button>
          <p className="title-text">{t("contactDetails")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex row">
            <div className={"form-field mt-20 flex-1"}>
              <MaterialTextField
                inputRef={register({
                  required: true,
                  minLength: 1,
                })}
                label={t("firstName")}
                variant="outlined"
                name="firstname"
                defaultValue={contactDetails.firstname}
                data-test-id="test-firstName"
              />
              {errors.firstname && errors.firstname.type === "required" && (
                <span className={"form-errors"}>{t("firstNameRequired")}</span>
              )}
              {errors.firstname && errors.firstname.type === "minLength" && (
                <span className={"form-errors"}>
                  {t("atLeast3LettersRequired")}
                </span>
              )}
            </div>
            <div style={{ width: "20px" }} />
            <div className={"form-field mt-20 flex-1"}>
              <MaterialTextField
                inputRef={register({ required: true, minLength: 1 })}
                label={t("lastName")}
                variant="outlined"
                name="lastname"
                defaultValue={contactDetails.lastname}
                data-test-id="test-lastName"
              />
              {errors.lastname && errors.lastname.type === "required" && (
                <span className={"form-errors"}>{t("lastNameRequired")}</span>
              )}
              {errors.lastname && errors.lastname.type === "minLength" && (
                <span className={"form-errors"}>
                  {t("atLeast3LettersRequired")}
                </span>
              )}
            </div>
          </div>

          <div className={"form-field mt-30"}>
            <MaterialTextField
              inputRef={register({
                required: true,
                pattern:
                  /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
                // validate: (input) => {
                //   return isAuthenticated || isSignedUp
                //     ? true
                //     : user.email === input;
                // },
              })}
              label={t("email")}
              variant="outlined"
              name="email"
              defaultValue={contactDetails.email}
              data-test-id="test-email"
              disabled={isAuthenticated}
            />
            {errors.email && errors.email.type !== "validate" && (
              <span className={"form-errors"}>{t("emailRequired")}</span>
            )}
            {/* {errors.email && errors.email.type === "validate" && (
              <span className={"form-errors"}>{t("useSameEmail")}</span>
            )} */}
          </div>

          <div className={"form-field mt-30"} style={{ position: "relative" }}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t("address")}
              variant="outlined"
              name="address"
              defaultValue={contactDetails.address}
              data-test-id="test-address"
              onChange={(event) => {
                suggestAddress(event.target.value);
              }}
              onBlur={() => setaddressSugggestions([])}
            />
            {addressSugggestions
              ? addressSugggestions.length > 0 && (
                  <div className="suggestions-container">
                    {addressSugggestions.map((suggestion) => {
                      return (
                        <div
                          key={"suggestion" + suggestion_counter++}
                          onMouseDown={() => {
                            getAddress(suggestion.text);
                          }}
                          className="suggestion"
                        >
                          {suggestion.text}
                        </div>
                      );
                    })}
                  </div>
                )
              : null}
            {errors.address && (
              <span className={"form-errors"}>{t("addressRequired")}</span>
            )}
          </div>

          <div className={"d-flex row"}>
            <div className={"form-field mt-30 flex-1"}>
              <MaterialTextField
                inputRef={register({ required: true })}
                label={t("city")}
                variant="outlined"
                name="city"
                defaultValue={contactDetails.city}
                data-test-id="test-city"
              />
              {errors.city && (
                <span className={"form-errors"}>{t("cityRequired")}</span>
              )}
            </div>
            <div style={{ width: "20px" }} />
            <div className={"form-field mt-30 flex-1"}>
              {true && (
                <MaterialTextField
                  inputRef={register({
                    required: true,
                    pattern: postalRegex,
                  })}
                  label={t("zipCode")}
                  variant="outlined"
                  name="zipCode"
                  defaultValue={contactDetails.zipCode}
                  data-test-id="test-zipCode"
                />
              )}
              {errors.zipCode && (
                <span className={"form-errors"}>
                  {t("zipCodeAlphaNumValidation")}
                </span>
              )}
            </div>
          </div>

          <div className={"form-field mt-30"}>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t("countryRequired"),
                },
              }}
              name="country"
              defaultValue={
                contactDetails.country ? contactDetails.country : country
              }
              render={({ value, ref }) => (
                <AutoCompleteCountry
                  inputRef={ref}
                  label={t("country")}
                  name="country"
                  onChange={changeCountry}
                  defaultValue={value}
                />
              )}
            />

            {errors.country && (
              <span className={"form-errors"}>{t("countryRequired")}</span>
            )}
          </div>

          <div className="contacts-isCompany-toggle mt-20">
            <label htmlFor="isCompany-toggle">
              {t("isACompanyDonation")}
              {isCompany && (
                <span
                  className={"isCompanyText"}
                  style={{ fontSize: "12px", fontStyle: "italic" }}
                >
                  {isTaxDeductible
                    ? t("orgNamePublishedTax")
                    : t("orgNamePublished")}
                </span>
              )}
            </label>
            <ToggleSwitch
              name="isCompany-toggle"
              checked={isCompany}
              onChange={() => setIsCompany(!isCompany)}
              id="isCompany-toggle"
            />
          </div>

          {isCompany ? (
            <div className={"form-field mt-20"}>
              <MaterialTextField
                label={t("companyName")}
                name="companyname"
                variant="outlined"
                inputRef={
                  isCompany
                    ? register({ required: true })
                    : register({ required: false })
                }
                defaultValue={contactDetails.companyname}
              />
              {errors.companyname && (
                <span className={"form-errors"}>{t("companyRequired")}</span>
              )}
            </div>
          ) : null}

          {errors.firstname ||
          errors.lastname ||
          errors.email ||
          errors.address ||
          errors.city ||
          errors.zipCode ||
          errors.country ? (
            <button className={"secondary-button mt-30"}>
              {t("continue")}
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              className={"primary-button mt-30"}
              data-test-id="test-continueToPayment"
            >
              {t("donate")}{" "}
              {getFormatedCurrency(
                i18n.language,
                currency,
                quantity * paymentSetup.unitCost
              )}{" "}
              {frequency}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default ContactsForm;
