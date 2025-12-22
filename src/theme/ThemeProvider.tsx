import React, { createContext, useContext } from 'react';
import { View, Text } from 'react-native';

const tokens = {
  colors: {
    primary: '#5B7CFA',
    background: '#FFFFFF',
    surface: '#F6F7FB',
    text: '#111827',
    muted: '#9CA3AF'
  },
  spacing: (factor: number) => factor * 8
};

const ThemeContext = createContext(tokens);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
