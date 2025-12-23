import React, { createContext } from 'react';
import { StatusBar } from 'react-native';
import { lightTheme } from './tokens';

export const ThemeContext = createContext(lightTheme);

export default function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={lightTheme}>
      <StatusBar barStyle="dark-content" />
      {children}
    </ThemeContext.Provider>
  );
}
