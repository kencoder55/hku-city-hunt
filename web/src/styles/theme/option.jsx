import Components from "./components/index.jsx";
import Palette from "./palette.jsx";
import Typography, { getTypography } from "./typography.jsx";

export function getThemeByLocale(locale) {
  return {
    palette: Palette,
    typography: getTypography(locale),
    components: Components,
  };
}

const themeOptions = {
  palette: Palette,
  typography: Typography,
  components: Components,
};

export default themeOptions;
