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
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "10px",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          minWidth: "240px",
        },
      },
    },
  },
});

export default MuiTheme;
