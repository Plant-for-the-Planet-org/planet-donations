import Grid from "@mui/material/Grid";
import { useTranslation } from "next-i18next";
import { FC, useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import MaterialTextField from "src/Common/InputTypes/MaterialTextField";
import ToggleSwitch from "src/Common/InputTypes/ToggleSwitch";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { OnBehalfDonor } from "src/Common/Types";
import { isEmailValid } from "src/Utils/isEmailValid";

const OnBehalf: FC = () => {
  const { t } = useTranslation("common");
  const { onBehalf, setOnBehalf, onBehalfDonor, setOnBehalfDonor } =
    useContext(QueryParamContext);

  const [shouldNotify, setShouldNotify] = useState(false);

  const defaultValues = {
    firstName: onBehalfDonor.firstName,
    lastName: onBehalfDonor.lastName,
    email: onBehalfDonor.email,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OnBehalfDonor>({
    mode: "all",
    defaultValues,
  });

  const onSubmit = (data: OnBehalfDonor) => {
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
              <Controller
                name="firstName"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <MaterialTextField
                    value={value}
                    onChange={onChange}
                    label={t("firstName")}
                    variant="outlined"
                  />
                )}
              />
              {errors.firstName && (
                <div className={"form-errors"}>{t("firstNameRequired")}</div>
              )}
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <MaterialTextField
                    value={value}
                    onChange={onChange}
                    label={t("lastName")}
                    variant="outlined"
                  />
                )}
              />
              {errors.lastName && (
                <div className={"form-errors"}>{t("lastNameRequired")}</div>
              )}
            </Grid>
            {shouldNotify ? (
              <Grid item xs={12}>
                <div className="d-flex row justify-content-between mb-10">
                  <p>{t("onBehalfNotification")}</p>
                  <button
                    onClick={() => setShouldNotify(false)}
                    className={"singleGiftRemove"}
                  >
                    {t("removeRecipient")}
                  </button>
                </div>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t("emailRequired"),
                    },
                    validate: {
                      emailInvalid: (value) =>
                        value.length === 0 || isEmailValid(value),
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <MaterialTextField
                      value={value}
                      onChange={onChange}
                      label={t("email")}
                      variant="outlined"
                    />
                  )}
                />
                {errors.email && errors.email.type === "required" && (
                  <div className={"form-errors"}>
                    {errors.email.type === "required"
                      ? t("emailRequired")
                      : t("inValidField", {
                          fieldName: "Email",
                        })}
                  </div>
                )}
              </Grid>
            ) : (
              <Grid item xs={12}>
                <div className={"form-field"}>
                  <button
                    onClick={() => setShouldNotify(true)}
                    className={"addEmailButton"}
                  >
                    {t("addEmail")}
                  </button>
                </div>
              </Grid>
            )}
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
        {t("donationOnBehalfOf", {
          firstName: onBehalfDonor.firstName,
          lastName: onBehalfDonor.lastName,
        })}
      </p>
      <p onClick={() => resetOnBehalfForm()} className="remove-on-behalf-donor">
        {t("removeRecipient")}
      </p>
    </div>
  );
};

export default OnBehalf;
