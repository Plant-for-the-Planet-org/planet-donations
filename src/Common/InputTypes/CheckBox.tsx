import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

export default function CheckBox(props: any) {
  const CheckBox = withStyles({
    // colorPrimary: { color: '#68B030' },
    // root: {
    //   color: '#68B030',
    //   '&$checked': {
    //     color: '#68B030',
    //   },
    // },
    // root: {
    //   '&$checked': {
    //     color: '#68B030',
    //   },
    // },
    // checked: {},
    root: {
      '& .MuiSvgIcon-root path': {
        fill: '#68B030',
      },
    },
    checked: {},
    // checked: { color: '#68B030' },
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
