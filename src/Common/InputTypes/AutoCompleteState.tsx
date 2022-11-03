/* eslint-disable no-use-before-define */
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import MaterialTextField from "./MaterialTextField";
import { useTranslation } from "next-i18next";
import themeProperties from "./../../../styles/themeProperties";
import { ThemeContext } from "../../../styles/themeContext";
import BRAZILIAN_STATES from "../../Utils/brazilianStateCodes";
import { ControllerRenderProps } from "react-hook-form";

function stateToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
}

export default function StateSelect(props: {
  label: React.ReactNode;
  inputRef?: ControllerRenderProps["ref"];
  name: string | undefined;
  defaultValue: string | undefined;
  onValueChange: (value: string) => void;
}) {
  const { ready } = useTranslation("country");
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
      // color: '#2F3336',
      fontFamily: themeProperties.fontFamily,
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
      fontSize: "14px",
      "& > span": {
        marginRight: 10,
        fontSize: 18,
      },
    },
  });

  const classes = useStylesAutoComplete();

  // This value is in country code - eg. DE, IN, US
  const { defaultValue, onValueChange } = props;

  // This value is an object with keys - code, label and phone
  // This has to be passed to the component as default value
  const [value, setValue] = React.useState();

  // use default country passed to create default object & set contact details
  React.useEffect(() => {
    // create default object
    const defaultState = BRAZILIAN_STATES.filter(
      (data) => data.code === defaultValue
    );
    if (defaultState && defaultState.length > 0) {
      // set initial value
      setValue(defaultState[0]);
      // set contact details
      onValueChange(defaultState[0].code);
    }
  }, [defaultValue]);

  // Set contact details everytime value changes
  React.useEffect(() => {
    if (value) {
      onValueChange(value?.code);
    }
  }, [value]);

  if (ready) {
    BRAZILIAN_STATES.sort((a, b) => {
      // const nameA = t(`country:${a.code.toLowerCase()}`);
      // const nameB = t(`country:${b.code.toLowerCase()}`);
      const nameA = a.code;
      const nameB = b.code;
      if (nameA > nameB) {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      return 0;
    });
  }

  return value && ready ? (
    <Autocomplete
      style={{ width: "100%" }}
      options={BRAZILIAN_STATES}
      classes={{
        option: classes.option,
        paper: classes.paper,
      }}
      value={value}
      autoHighlight
      getOptionLabel={(option) => option.name}
      renderOption={(option) => (
        <>
          <span>{stateToFlag(option.code)}</span>
          {option.name}
        </>
      )}
      onChange={(
        _: React.ChangeEvent<Record<string, unknown>>,
        newValue: State | null
      ) => {
        if (newValue) {
          setValue(newValue);
        }
      }}
      defaultValue={value.name}
      renderInput={(params) => (
        <MaterialTextField
          {...params}
          label={props.label}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
          name={"statedropdown"}
        />
      )}
    />
  ) : null;
}

interface State {
  code: string;
  id: number;
  name: string;
}
