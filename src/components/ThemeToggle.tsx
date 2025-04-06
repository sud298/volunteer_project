"use client";

import { useTheme } from "@/context/ThemeContext";
import { Button } from "primereact/button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      icon={theme === "light" ? "pi pi-moon" : "pi pi-sun"}
      label={theme === "light" ? "Dark Mode" : "Light Mode"}
      className="p-button-outlined"
      onClick={toggleTheme}
    />
  );
}
