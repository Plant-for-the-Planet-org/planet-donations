import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
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
  const ToggleSwitch = withStyles({
    switchBase: {
      color: "#fff",
      "&$checked": {
        color: props.color ? props.color : "#68B030",
      },
      "&$checked + $track": {
        backgroundColor: props.color ? props.color : "#68B030",
      },
    },
    checked: {},
    track: {},
  })(Switch);

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

//export default ToggleSwitch;
