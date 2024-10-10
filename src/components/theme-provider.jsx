/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react"; // Import necessary hooks and functions

// Initial state for the theme context
const initialState = {
  theme: "system", // Default theme setting
  setTheme: () => null, // Placeholder for setTheme function
};

// Create a context for the theme provider
const ThemeProviderContext = createContext(initialState);

// ThemeProvider component to manage theme settings and provide context
export function ThemeProvider({
  children,
  defaultTheme = "system", // Default theme if none is set
  storageKey = "vite-ui-theme", // Key to store the theme in localStorage
  ...props
}) {
  // State for the current theme, initialized from localStorage or defaultTheme
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  // Effect to apply the theme class to the document root when theme changes
  useEffect(() => {
    const root = window.document.documentElement; // Get the root element

    // Remove any existing theme classes
    root.classList.remove("light", "dark");

    // Determine system theme if current theme is 'system'
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark" // Use dark theme if system preference is dark
        : "light"; // Use light theme otherwise

      root.classList.add(systemTheme); // Apply system theme
      return; // Exit the effect
    }

    // Apply the selected theme
    root.classList.add(theme);
  }, [theme]); // Run effect when theme changes

  // Value to be provided to the context
  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme); // Save theme to localStorage
      setTheme(theme); // Update theme state
    },
  };

  // Provide context value to children
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use theme context in other components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext); // Get context

  // Throw error if used outside of ThemeProvider
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context; // Return the context value
};
