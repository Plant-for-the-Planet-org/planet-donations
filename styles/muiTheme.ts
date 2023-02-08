import { createTheme } from "@mui/material/styles";

const MuiTheme = createTheme({
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
  },
});

export default MuiTheme;
