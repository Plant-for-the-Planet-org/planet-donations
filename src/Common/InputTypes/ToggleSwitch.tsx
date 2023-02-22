import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { ChangeEvent, InputHTMLAttributes, ReactElement } from "react";

interface Props {
  [key: string]: unknown;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  name?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  id?: string;
  color?: string;
}

export default function ToggleSwitch(props: Props): ReactElement {
  const ToggleSwitch = styled(Switch)({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: props.color ? props.color : undefined, //if color is undefined, it will be taken from the theme primary color
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: props.color ? props.color : undefined,
    },
  });

  // Remove color from props as expected values are "default", "primary" etc. as defined by Mui
  const cleanedProps = { ...props, color: undefined };

  return (
    <ToggleSwitch
      {...cleanedProps} // pass down additional props
      checked={props.checked}
      onChange={props.onChange}
      name={props.name}
      inputProps={props.inputProps}
      id={props.id}
    />
  );
}
