import { Grid } from "@material-ui/core";
import { FC, useContext } from "react";
import { useForm } from "react-hook-form";
import MaterialTextField from "src/Common/InputTypes/MaterialTextField";
import ToggleSwitch from "src/Common/InputTypes/ToggleSwitch";
import { QueryParamContext } from "src/Layout/QueryParamContext";

const OnBehalf: FC = () => {
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
        {/* // translation Req */}
        <p>This donation is on behalf of someone</p>
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
                // translation Req
                label={"First Name"}
                variant="outlined"
              />
              {/* // translation Req */}
              {errors.firstName && (
                <span className={"form-errors"}>First Name is Required</span>
              )}
            </Grid>
            <Grid item xs={6}>
              <MaterialTextField
                name="lastName"
                inputRef={register({ required: true })}
                // translation Req
                label={"Last Name"}
                variant="outlined"
              />
              {/* // translation Req */}
              {errors.lastName && (
                <span className={"form-errors"}>Last Name is Required</span>
              )}
            </Grid>
            <Grid item xs={12}>
              <MaterialTextField
                name="email"
                inputRef={register({
                  required: true,
                  pattern:
                    /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
                })}
                // translation Req
                label={"Email"}
                variant="outlined"
              />
              {/* // translation Req */}
              {errors.email && (
                <span className={"form-errors"}>Email is Required</span>
              )}
            </Grid>
          </Grid>
          <button
            onClick={handleSubmit(onSubmit)}
            className="primary-button w-100 mt-30"
          >
            {/* translation Req */}
            Continue
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <div className="on-behalf-donor-info mt-10">
      {/* translation Req  */}
      <p>
        This donation is on behalf of{" "}
        {onBehalfDonor.firstName + " " + onBehalfDonor.lastName}
      </p>
      {/* translation Req  */}
      <p onClick={() => resetOnBehalfForm()} className="remove-on-behalf-donor">
        Remove
      </p>
    </div>
  );
};

export default OnBehalf;
