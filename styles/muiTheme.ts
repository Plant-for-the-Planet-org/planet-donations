import { createTheme } from "@mui/material/styles";
import themeProperties from "./themeProperties";

const MuiTheme = createTheme({
  palette: {
    primary: {
      main: themeProperties.primaryColor,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: "0.875rem",
          lineHeight: 1.43,
          letterSpacing: "0.01071em",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          backgroundColor: themeProperties.primaryColor,
        },
      },
    },
  },
});

export default MuiTheme;
