type ThemeColors = "Rose" | "Green" | "Orange" | "Blue";

interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}
