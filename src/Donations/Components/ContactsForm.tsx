import React, { ReactElement } from "react";
import MaterialTextField from "../../Common/InputTypes/MaterialTextField";
import AutoCompleteCountry from "../../Common/InputTypes/AutoCompleteCountry";
import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import ToggleSwitch from "../../Common/InputTypes/ToggleSwitch";
import COUNTRY_ADDRESS_POSTALS from "./../../Utils/countryZipCode";
import BackButtonIcon from "../../../public/assets/icons/BackButtonIcon";
import GeocoderArcGIS from "geocoder-arcgis";
import themeProperties from "../../../styles/themeProperties";
import { ThemeContext } from "../../../styles/themeContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import getFormattedCurrency from "src/Utils/getFormattedCurrency";
import { DONATE, PAYMENT } from "src/Utils/donationStepConstants";
import { ContactDetails } from "@planet-sdk/common";
import { AddressCandidate, GeocodeSuggestion } from "src/Common/Types/arcgis";
import GiftIcon from "public/assets/icons/GiftIcon";
import { euCountries } from "src/Utils/countryUtils";
import { isEmailValid } from "src/Utils/isEmailValid";
// import { DevTool } from "@hookform/devtools";

interface FormData extends ContactDetails {
  isPackageWanted: boolean;
}

function ContactsForm(): ReactElement {
  const { t, i18n } = useTranslation("common");

  React.useEffect(() => {
    setaddressSugggestions([]);
  }, []);

  const router = useRouter();
  const [isCompany, setIsCompany] = React.useState(false);
  const [isEligibleForPackage, setIsEligibleForPackage] = React.useState(false);
  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );
  const {
    profile,
    contactDetails,
    updateContactDetails,
    country,
    isTaxDeductible,
    currency,
    quantity,
    paymentSetup,
    frequency,
    projectDetails,
    taxIdentificationAvail,
    setTaxIdentificationAvail,
    isPackageWanted,
    setIsPackageWanted,
  } = React.useContext(QueryParamContext);

  const { isAuthenticated } = useAuth0();

  React.useEffect(() => {
    if (contactDetails) {
      reset({
        ...contactDetails,
        isPackageWanted: isPackageWanted !== false && isEligibleForPackage,
      });
      if (contactDetails.companyname) {
        setIsCompany(true);
      }
    }
  }, [contactDetails, isPackageWanted, isEligibleForPackage]);

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: contactDetails,
  });

  React.useEffect(() => {
    const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter(
      (country) => country.abbrev === contactDetails.country
    );
    setPostalRegex(fiteredCountry[0]?.postal);
  }, [contactDetails.country]);

  const onSubmit = (data: FormData) => {
    const { isPackageWanted, ...enteredContactDetails } = data;
    updateContactDetails({
      ...enteredContactDetails,
      email: isAuthenticated
        ? contactDetails.email
        : enteredContactDetails.email,
    });
    setIsPackageWanted(isEligibleForPackage ? isPackageWanted : null);
    router.push(
      {
        query: { ...router.query, step: PAYMENT },
      },
      undefined,
      { shallow: true }
    );
  };

  const [postalRegex, setPostalRegex] = React.useState(
    COUNTRY_ADDRESS_POSTALS.filter(
      (country) => country.abbrev === contactDetails.country
    )[0]?.postal
  );

  const changeCountry = (country: string) => {
    let data = getValues();
    data = {
      ...data,
      country,
    };
    updateContactDetails(data);
  };

  React.useEffect(() => {
    if (
      projectDetails?.purpose === "funds" &&
      projectDetails.id === "proj_rLYELl1JpkT9sskba0sLPeKi" &&
      euCountries.includes(contactDetails.country)
    ) {
      setIsEligibleForPackage(true);
      setValue("isPackageWanted", true);
    } else {
      setIsEligibleForPackage(false);
      setValue("isPackageWanted", false);
    }
  }, [projectDetails, contactDetails.country]);

  const [addressSugggestions, setaddressSugggestions] = React.useState<
    GeocodeSuggestion[]
  >([]);

  const suggestAddress = (value: string) => {
    if (value.length > 3) {
      geocoder
        .suggest(value, {
          category: "Address",
          countryCode: contactDetails.country,
        })
        .then((result: { suggestions: GeocodeSuggestion[] }) => {
          const filterdSuggestions = result.suggestions.filter((suggestion) => {
            return !suggestion.isCollection;
          });
          setaddressSugggestions(filterdSuggestions);
        })
        .catch(console.log);
    }
  };

  const getAddress = (value: string) => {
    geocoder
      .findAddressCandidates(value, { outfields: "*" })
      .then((result: { candidates: AddressCandidate[] }) => {
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

  React.useEffect(() => {
    if (
      projectDetails &&
      projectDetails.taxDeductionCountries &&
      projectDetails.taxDeductionCountries?.includes("ES") &&
      country == "ES"
    ) {
      setTaxIdentificationAvail(true);
    } else {
      setTaxIdentificationAvail(false);
    }
  }, [projectDetails, country]);

  const { theme } = React.useContext(ThemeContext);
  let suggestion_counter = 0;
  return (
    <div className="right-panel-container">
      <div className="donations-form">
        <div className="d-flex w-100 align-items-center">
          <button
            className="d-flex"
            onClick={() => {
              router.push(
                {
                  query: { ...router.query, step: DONATE },
                },
                undefined,
                { shallow: true }
              );
            }}
            style={{ marginRight: "12px" }}
          >
            <BackButtonIcon
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
              <Controller
                name="firstname"
                control={control}
                rules={{
                  required: t("firstNameRequired"),
                  maxLength: {
                    value: 50,
                    message: t("max50Chars"),
                  },
                  pattern: {
                    value: /^[\p{L}\p{N}ß][\p{L}\p{N}\sß.'-]*$/u,
                    message: t("firstNameInvalid"),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label={t("firstName")}
                    variant="outlined"
                    data-test-id="test-firstName"
                  />
                )}
              />
              {errors.firstname !== undefined && (
                <div className={"form-errors"}>{errors.firstname.message}</div>
              )}
            </div>
            <div style={{ width: "20px" }} />
            <div className={"form-field mt-20 flex-1"}>
              <Controller
                name="lastname"
                control={control}
                rules={{
                  required: t("lastNameRequired"),
                  maxLength: {
                    value: 50,
                    message: t("max50Chars"),
                  },
                  pattern: {
                    value: /^[\p{L}\p{N}ß][\p{L}\p{N}\sß'-]*$/u,
                    message: t("lastNameInvalid"),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label={t("lastName")}
                    variant="outlined"
                    data-test-id="test-lastName"
                  />
                )}
              />
              {errors.lastname !== undefined && (
                <div className={"form-errors"}>{errors.lastname.message}</div>
              )}
            </div>
          </div>

          <div className={"form-field mt-30"}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: t("emailRequired"),
                validate: {
                  emailInvalid: (value) =>
                    value.length === 0 ||
                    isEmailValid(value) ||
                    t("enterValidEmail"),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <MaterialTextField
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  label={t("email")}
                  variant="outlined"
                  data-test-id="test-email"
                  disabled={profile !== null && profile?.email.length !== 0}
                />
              )}
            />
            {errors.email !== undefined && (
              <div className={"form-errors"}>{errors.email.message}</div>
            )}
          </div>

          <div className={"form-field mt-30"} style={{ position: "relative" }}>
            <Controller
              name="address"
              control={control}
              rules={{
                required: t("addressRequired"),
                pattern: {
                  value: /^[\p{L}\p{N}\sß.,#/-]+$/u,
                  message: t("addressInvalid"),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <MaterialTextField
                  onChange={(event) => {
                    suggestAddress(event.target.value);
                    onChange(event);
                  }}
                  value={value}
                  label={t("address")}
                  variant="outlined"
                  data-test-id="test-address"
                  onBlur={() => {
                    setaddressSugggestions([]);
                    onBlur();
                  }}
                />
              )}
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
            {errors.address !== undefined && (
              <div className={"form-errors"}>{errors.address.message}</div>
            )}
          </div>

          <div className={"d-flex row"}>
            <div className={"form-field mt-30 flex-1"}>
              <Controller
                name="city"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("cityRequired"),
                  },
                  pattern: {
                    value: /^[\p{L}\sß.,()-]+$/u,
                    message: t("cityInvalid"),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label={t("city")}
                    variant="outlined"
                    data-test-id="test-city"
                  />
                )}
              />
              {errors.city !== undefined && (
                <div className={"form-errors"}>{errors.city.message}</div>
              )}
            </div>
            <div style={{ width: "20px" }} />
            <div className={"form-field mt-30 flex-1"}>
              <Controller
                name="zipCode"
                control={control}
                rules={{
                  required: t("zipCodeRequired"),
                  pattern: {
                    value: postalRegex as RegExp,
                    message: t("zipCodeInvalid"),
                  },
                  maxLength: {
                    value: 15,
                    message: t("zipCodeInvalid"),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label={t("zipCode")}
                    variant="outlined"
                    data-test-id="test-zipCode"
                  />
                )}
              />
              {errors.zipCode !== undefined && (
                <div className={"form-errors"}>{errors.zipCode.message}</div>
              )}
            </div>
          </div>

          <div className={"form-field mt-30"}>
            <Controller
              name="country"
              control={control}
              rules={{
                required: t("countryRequired"),
              }}
              defaultValue={
                contactDetails.country ? contactDetails.country : country
              }
              render={({ field: { value, ref } }) => (
                <AutoCompleteCountry
                  inputRef={ref}
                  label={t("country")}
                  name="country"
                  onValueChange={changeCountry}
                  defaultValue={value}
                />
              )}
            />
            {errors.country && (
              <div className={"form-errors"}>{errors.country.message}</div>
            )}
          </div>

          {taxIdentificationAvail ? (
            <div
              className={"form-field mt-30"}
              data-test-id="taxIdentiication"
              id="taxIdentificationAvail"
            >
              <Controller
                name="tin"
                control={control}
                rules={{ required: t("tinRequired") }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label={t("taxIdentificationNumber")}
                    variant="outlined"
                  />
                )}
              />
              {errors.tin !== undefined && (
                <div className={"form-errors"}>{errors.tin.message}</div>
              )}
            </div>
          ) : (
            <></>
          )}

          {isEligibleForPackage && (
            <div className="welcome-package-toggle mt-20">
              <label htmlFor="welcomePackage-toggle">
                <GiftIcon color={themeProperties.light.secondaryColor} />
                {t("welcomePackageConsent")}
              </label>
              <Controller
                name="isPackageWanted"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    checked={value}
                    onChange={onChange}
                    id="welcomePackage-toggle"
                  />
                )}
              />
            </div>
          )}

          {(profile === null || profile.type === undefined) && (
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
          )}

          {isCompany ||
          (profile &&
            profile.type !== "individual" &&
            profile.type !== undefined) ? (
            <div
              className={`form-field ${profile === null ? "mt-20" : "mt-30"}`}
            >
              <Controller
                name="companyname"
                control={control}
                rules={{
                  required: t("companyRequired"),
                  pattern: {
                    value: /^[\p{L}\p{N}\sß.,'&()!-]+$/u,
                    message: t("companyNameInvalid"),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label={t("companyName")}
                    variant="outlined"
                    data-test-id="test-companyname"
                    disabled={profile !== null && profile.type !== undefined}
                    helperText={
                      profile !== null ? t("companyUneditableHelpText") : ""
                    }
                  />
                )}
              />
              {errors.companyname !== undefined && (
                <div className={"form-errors"}>
                  {errors.companyname.message}
                </div>
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
            <button
              className={"secondary-button mt-30"}
              data-test-id="test-continueDisabled"
            >
              {t("continue")}
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              className={"primary-button mt-30"}
              data-test-id="test-continueToPayment"
            >
              {paymentSetup &&
                t("donate_button", {
                  totalCost: getFormattedCurrency(
                    i18n.language,
                    currency,
                    paymentSetup.unitCost * quantity
                  ),
                  frequency:
                    frequency === "once" ? "" : t(frequency).toLowerCase(),
                })}
            </button>
          )}
        </form>
        {/* <DevTool control={control} /> */}
      </div>
    </div>
  );
}

export default ContactsForm;
