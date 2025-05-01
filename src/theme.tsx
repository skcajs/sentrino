import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#333333",
    },
    secondary: {
      main: "#6F4A7D",
    },
    background: {
      default: "#ebebf0",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#222222",
          color: "#FFFFFF",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          backgroundColor: "#505050",
          color: "#FFFFFF",
        },
        colorDisabled: {
          color: "#505050",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#444444",
        },
      },
    },
  },
});
