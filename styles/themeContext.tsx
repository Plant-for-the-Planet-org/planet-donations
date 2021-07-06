import React from 'react';

export const ThemeContext = React.createContext({
  theme: 'theme-light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export default function ThemeProvider({ children }:any) {
  const [theme, setTheme] = React.useState('theme-light');

  const toggleTheme = () => {
    setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme,setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
