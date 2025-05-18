type ThemeColors = "Zinc" | "Rose" | "Green" | "Orange";

interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}
