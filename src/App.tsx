import "./App.css";
import AppLayout from "./components/AppLayout";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppLayout />
      </ThemeProvider>
    </>
  );
}

export default App;
