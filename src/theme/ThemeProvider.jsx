import React, { createContext } from 'react';
import { StatusBar } from 'react-native';

export const ThemeContext = createContext({
  colors: {
    background: '#fff',
    text: '#111',
    primary: '#6C5CE7',
    card: '#F7F7FC',
  },
});

export default function ThemeProvider({ children }) {
  const theme = {
    colors: {
      background: '#fff',
      text: '#111',
      primary: '#6C5CE7',
      card: '#F7F7FC',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      {children}
    </ThemeContext.Provider>
  );
}
