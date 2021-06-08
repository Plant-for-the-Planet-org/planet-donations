import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import themeProperties from './../../../styles/themeProperties';
const MaterialTextField = withStyles({
  root: {
    width: '100%',
    '& label.Mui-focused': {
      color: '#2F3336',
      fontFamily: themeProperties.fontFamily,
    },
    '& label': {
      color: '#2F3336',
      fontFamily: themeProperties.fontFamily,
      fontSize: '14px',
      top:'-3px'
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink':{
        transform:'translate(14px, -4px) scale(0.75)'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0px!important',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#F2F2F7',
      border: '0px!important',
      borderRadius: '10px',
      fontFamily: themeProperties.fontFamily,
    },
    '& .MuiOutlinedInput-input':{
        padding:'14px'
    },
    '& .MuiOutlinedInput-multiline':{
      padding:'0px'
    },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]':{
      padding:'14px'
    },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input':{
      padding:'0px'
    },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child':{
      paddingLeft:'0px'
    }
  },
})(TextField);

export default MaterialTextField;
