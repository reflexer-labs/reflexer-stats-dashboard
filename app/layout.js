'use client';

import './globals.css';
import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import { client } from './utils/graph';
import { ApolloProvider } from '@apollo/client';
import { Flex, Box } from '@chakra-ui/react';
import { Header } from './shared/Header';
import { Footer } from './shared/Footer';

import AppContextProvider from './context/AppContext';

const poppins = Poppins({ subsets: ['latin'], weight: '500' });

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <AppContextProvider>
          <ApolloProvider client={client}>
            <Providers>
              <Box bg='black'>
                <Flex
                  direction='column'
                  justifyContent='space-between'
                  maxW='90rem'
                  minH='100vh'
                  mx='auto'
                  pt='2rem'
                  px={{ lg: '4rem', sm: '2rem' }}
                  bg='black'
                  color='white'
                >
                  <Header />
                  {children}
                  <Footer />
                </Flex>
              </Box>
            </Providers>
          </ApolloProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
