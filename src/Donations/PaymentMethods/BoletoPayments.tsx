import React, { ReactElement, useContext } from "react";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import StateSelect from "src/Common/InputTypes/AutoCompleteState";
import MaterialTextField from "src/Common/InputTypes/MaterialTextField";
import { Controller, useForm } from "react-hook-form";
import GeocoderArcGIS from "geocoder-arcgis";

interface Props {
  onSubmitPayment: (
    gateway: string,
    method: string,
    providerObject?: any
  ) => void;
}

function BoletoPayPayments({ onSubmitPayment }: Props): ReactElement {
  const { t } = useTranslation("common");
  const {
    contactDetails,
    setContactDetails,
    boletoBillingDetails,
    setBoletoBillingDetails,
  } = useContext(QueryParamContext);

  const {
    register,
    errors,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    setError,
  } = useForm({
    mode: "all",
    defaultValues: {},
  });

  const [addressSugggestions, setaddressSugggestions] = React.useState([]);
  const [disable, setDisable] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (
      boletoBillingDetails &&
      Object.keys(boletoBillingDetails).length === 9
    ) {
      onSubmitPayment("stripe", "boleto", "boleto");
      setBoletoBillingDetails(null);
    }
  }, [boletoBillingDetails]);

  React.useEffect(() => {
    if (
      errors.firstname ||
      errors.lastname ||
      errors.email ||
      errors.address ||
      errors.city ||
      errors.zipCode ||
      errors.state ||
      errors.cnpOrCnjpNumber
    ) {
      setDisable(true);
    } else setDisable(false);
  }, [Object.keys(errors).length]);

  React.useEffect(() => {
    const data = getValues();
    if (!data.cnpOrCnjpNumber) {
      setError("cnpOrCnjpNumber", t("cnpOrCnjpNumberRequired"));
    }
  }, []);

  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );

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

  const onSubmit = (data) => {
    setBoletoBillingDetails({ ...data, country: "BR" });
    setDisable(true);
  };

  let suggestion_counter = 0;

  return (
    <>
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
            })}
            label={t("email")}
            variant="outlined"
            name="email"
            defaultValue={contactDetails.email}
            data-test-id="test-email"
          />
          {errors.email && errors.email.type !== "validate" && (
            <span className={"form-errors"}>{t("emailRequired")}</span>
          )}
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
                  pattern: /^[0-9]{5}-[0-9]{3}$/,
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
                message: t("stateRequired"),
              },
            }}
            name="state"
            defaultValue={"SP"}
            render={({ value, ref }) => (
              <StateSelect
                label={t("state")}
                inputRef={ref}
                name="state"
                onValueChange={(state) => {
                  setBoletoBillingDetails(state);
                }}
                defaultValue={value}
              />
            )}
          />

          {errors.state && (
            <span className={"form-errors"}>{t("stateRequired")}</span>
          )}
        </div>

        <div className={"form-field mt-30"}>
          <MaterialTextField
            inputRef={register({
              required: true,
              pattern: /^[\w\W]{11}$|^[\w\W]{14}$|^[\w\W]{18}$/,
            })}
            label={t("cnpOrCnjpNumber")}
            variant="outlined"
            name="cnpOrCnjpNumber"
            defaultValue={""}
          />
          {errors.cnpOrCnjpNumber &&
            errors.cnpOrCnjpNumber.type !== "validate" && (
              <span className={"form-errors"}>
                {t("cnpOrCnjpNumberRequired")}
              </span>
            )}
        </div>

        <button
          disabled={disable}
          type="submit"
          className={
            disable
              ? "secondary-button w-100 mt-30"
              : "primary-button w-100 mt-30"
          }
        >
          {t("payWithBoleto")}
        </button>
      </form>
    </>
  );
}

export default BoletoPayPayments;
