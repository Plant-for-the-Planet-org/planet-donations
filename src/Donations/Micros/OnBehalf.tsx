import { Grid } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";
import { useForm } from "react-hook-form";
import MaterialTextField from "src/Common/InputTypes/MaterialTextField";
import ToggleSwitch from "src/Common/InputTypes/ToggleSwitch";
import { QueryParamContext } from "src/Layout/QueryParamContext";

const OnBehalf: FC = () => {
  const { t } = useTranslation("common");
  const { onBehalf, setOnBehalf, onBehalfDonor, setOnBehalfDonor } =
    useContext(QueryParamContext);

  const defaultValues = {
    firstName: onBehalfDonor.firstName,
    lastName: onBehalfDonor.lastName,
    email: onBehalfDonor.email,
  };

  const { register, errors, handleSubmit, reset } = useForm({
    mode: "all",
    defaultValues,
  });

  const onSubmit = (data) => {
    setOnBehalfDonor(data);
  };

  const resetOnBehalfForm = () => {
    const defaultValues = {
      firstName: "",
      lastName: "",
      email: "",
    };
    setOnBehalfDonor(defaultValues);
    setOnBehalf(false);
    reset(defaultValues);
  };

  return onBehalfDonor.firstName === "" ? (
    <div className="on-behalf-container mt-10">
      <div className="on-behalf-container-toggle">
        <p>{t("donationOnBehalfText")}</p>
        <ToggleSwitch
          checked={onBehalf}
          onChange={() => setOnBehalf((onBehalf) => !onBehalf)}
        />
      </div>
      {onBehalf && onBehalfDonor.firstName === "" ? (
        <div className="on-behalf-container-form-container mt-10">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <MaterialTextField
                name="firstName"
                inputRef={register({ required: true })}
                label={t("firstName")}
                variant="outlined"
              />
              {errors.firstName && (
                <span className={"form-errors"}>{t("firstNameRequired")}</span>
              )}
            </Grid>
            <Grid item xs={6}>
              <MaterialTextField
                name="lastName"
                inputRef={register({ required: true })}
                label={t("lastName")}
                variant="outlined"
              />
              {errors.lastName && (
                <span className={"form-errors"}>{t("lastNameRequired")}</span>
              )}
            </Grid>
            <Grid item xs={12}>
              <MaterialTextField
                name="email"
                inputRef={register({
                  pattern:
                    /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
                })}
                label={t("email")}
                variant="outlined"
              />
              {errors.email && (
                <span className={"form-errors"}>{t("invalidEmail")}</span>
              )}
            </Grid>
          </Grid>
          <button
            onClick={handleSubmit(onSubmit)}
            className="primary-button w-100 mt-30"
          >
            {t("continue")}
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <div className="on-behalf-donor-info mt-10">
      <p>
        {t("donationOnBehalfOf")}&nbsp;
        {onBehalfDonor.firstName + " " + onBehalfDonor.lastName}
      </p>
      <p onClick={() => resetOnBehalfForm()} className="remove-on-behalf-donor">
        {t("removeRecipient")}
      </p>
    </div>
  );
};

export default OnBehalf;
