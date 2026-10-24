import { ThemeProviderContext } from "@/providers/ThemeProvider";
import type { ResolvedTheme, Theme } from "@/providers/ThemeProvider";
import { useContext } from "react";

export type { ResolvedTheme, Theme };

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
