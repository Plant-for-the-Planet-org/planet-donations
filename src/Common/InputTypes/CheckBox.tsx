import { withStyles } from "@mui/styles";
import Checkbox from "@mui/material/Checkbox";
import { ChangeEvent, InputHTMLAttributes, ReactElement } from "react";

interface Props {
  color?: "primary" | "default" | "secondary";
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  name: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  id: string;
}

export default function CheckBox(props: Props): ReactElement {
  const CheckBox = withStyles({
    checked: {
      "& .MuiSvgIcon-root path": {
        fill: "#68B030",
      },
    },
  })(Checkbox);
  return (
    <CheckBox
      color={props.color}
      checked={props.checked}
      onChange={props.onChange}
      name={props.name}
      inputProps={props.inputProps}
      id={props.id}
    />
  );
}
