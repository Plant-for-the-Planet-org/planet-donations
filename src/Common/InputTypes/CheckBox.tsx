import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { ChangeEvent, InputHTMLAttributes, ReactElement } from "react";

interface Props {
  color?: "primary" | "default" | "secondary";
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  name: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  id: string;
}

const StyledCheckbox = styled(Checkbox)({
  "&.Mui-checked .MuiSvgIcon-root path": {
    fill: "#68B030",
  },
});

export default function CheckBox(props: Props): ReactElement {
  return (
    <StyledCheckbox
      color={props.color}
      checked={props.checked}
      onChange={props.onChange}
      name={props.name}
      inputProps={props.inputProps}
      id={props.id}
    />
  );
}
