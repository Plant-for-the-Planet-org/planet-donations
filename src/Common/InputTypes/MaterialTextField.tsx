import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import themeProperties from "./../../../styles/themeProperties";

const MaterialTextField = styled(TextField)({
  width: "100%",
  color: "var(--primary-font-color)",
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    color: "var(--primary-font-color)",
    height: "1.1876em",
    lineHeight: "1.1876em",
  },
  "& .MuiInputAdornment-root": {
    color: "var(--primary-font-color)",
  },
  "& label.Mui-focused": {
    color: "var(--primary-font-color)",
    fontFamily: themeProperties.fontFamily,
  },
  "& label": {
    color: "var(--primary-font-color)",
    fontFamily: themeProperties.fontFamily,
    fontSize: "14px",
    lineHeight: 1,
  },
  "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
    transform: "translate(14px, -4px) scale(0.75)",
    top: "-3px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "0px!important",
  },
  "& .Mui-disabled.MuiInputLabel-root": {
    color: "var(--primary-font-color)",
  },
  "& .Mui-disabled.MuiOutlinedInput-input ": {
    color: "var(--disabled-font-color)",
    WebkitTextFillColor: "initial",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--background-color-dark)",
    border: "0px!important",
    borderRadius: "10px",
    fontFamily: themeProperties.fontFamily,
  },
  "& .MuiOutlinedInput-input": {
    padding: "14px",
  },
  "& .MuiOutlinedInput-multiline": {
    padding: "0px",
  },
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
    padding: "14px",
  },
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input':
    {
      padding: "0px",
    },
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-of-type':
    {
      paddingLeft: "0px",
    },
});

export default MaterialTextField;
