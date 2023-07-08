'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const breakpoints = {
  base: '320px',
  md: '620px',
  lg: '1020px'
};

const theme = extendTheme({
  breakpoints
});

export function Providers({ children }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
