import { createTheme } from "@mantine/core";
import { colors } from "./colors";
import { typography } from "./typography";
import { components } from "./components";

export const theme = createTheme({
  ...typography,
  primaryColor: "glowingRed",
  defaultRadius: "3px",
  colors: {
    glowingRed: colors.glowingRed,
  },
  other: {
    text: colors.text,
    background: colors.background,
    secondaryBackground: colors.secondaryBackground,
    primary: colors.primary,
  },
  components,
});
