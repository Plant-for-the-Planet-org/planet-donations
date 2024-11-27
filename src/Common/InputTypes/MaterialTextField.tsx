import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import themeProperties from "./../../../styles/themeProperties";

const MaterialTextField = styled(TextField)({
  width: "100%",
  color: "var(--primary-font-color)",

  // Label styles
  "& label": {
    color: "var(--primary-font-color)",
    fontFamily: themeProperties.fontFamily,
    fontSize: "14px",
    lineHeight: "1",
  },

  // Base label positioning
  "& .MuiInputLabel-root": {
    transform: "translate(14px, 16px) scale(1)", // Matches original position
    transformOrigin: "left top",
    position: "absolute",
    left: 0,
    top: 0,
    display: "block",
    padding: 0,
    pointerEvents: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "calc(100% - 24px)",
  },

  // Shrunk/focused label
  "& label.Mui-focused": {
    color: "var(--primary-font-color)",
    fontFamily: themeProperties.fontFamily,
  },

  "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
    transform: "translate(14px, -4px) scale(0.75)",
    top: "-3px", // Critical for matching original position
    pointerEvents: "auto",
    maxWidth: "calc(133% - 32px)",
  },

  // Input styles
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    color: "var(--primary-font-color)",
    height: "20px",
    lineHeight: "20px",
    padding: "14px",
  },

  // Input container
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--background-color-dark)",
    borderRadius: "10px",
    fontFamily: themeProperties.fontFamily,
    minHeight: "44px",

    "& fieldset": {
      border: "none",
    },
  },

  // Input adornment
  "& .MuiInputAdornment-root": {
    color: "var(--primary-font-color)",
  },

  // Notched outline
  "& .MuiOutlinedInput-notchedOutline": {
    border: "0px!important",
  },

  // Disabled state
  "& .Mui-disabled": {
    "&.MuiInputLabel-root": {
      color: "var(--primary-font-color)",
    },
    "&.MuiOutlinedInput-input": {
      color: "var(--disabled-font-color)",
      WebkitTextFillColor: "initial",
    },
  },

  // Multiline
  "& .MuiInputBase-multiline": {
    padding: "0px",
  },

  // Autocomplete
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
    padding: "14px",

    "& .MuiAutocomplete-input": {
      padding: "0px",

      "&:first-of-type": {
        paddingLeft: "0px",
      },
    },
  },
});

export default MaterialTextField;
