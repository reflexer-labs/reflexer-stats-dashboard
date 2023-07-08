'use client';

import {
  Flex,
  Image as ChakraImage,
  SimpleGrid,
  Text,
  Link as ChakraLink
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export const Footer = () => {
  const router = useRouter();

  return (
    <Flex direction='column' bg='rgb(5, 25, 46)' py='2rem' px='4rem' mt='2rem'>
      <Flex
        direction={{ lg: 'row', sm: 'column-reverse' }}
        justifyContent='space-between'
      >
        <ChakraImage
          src='/brand-white.png'
          alt='Reflexer Finance'
          w={{ lg: 'auto', sm: '100px' }}
          h={{ lg: '30px', sm: 'auto' }}
          mt={{ lg: 0, sm: '2rem' }}
          cursor='pointer'
          onClick={() => router.push('/')}
        />
        <SimpleGrid columns={{ lg: 3, sm: 1 }} gap={{ lg: '20', sm: '10' }}>
          <Flex direction='column'>
            <Text mb='10px'>Project</Text>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              mb='5px'
              href='https://github.com/reflexer-labs'
              isExternal
            >
              Github
            </ChakraLink>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              mb='5px'
              href='https://docs.reflexer.finance/'
              isExternal
            >
              Docs
            </ChakraLink>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              mb='5px'
              href='https://medium.com/reflexer-labs/stability-without-pegs-8c6a1cbc7fbd'
              isExternal
            >
              RAI Explainer
            </ChakraLink>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              href='https://memes.reflexer.finance/'
              isExternal
            >
              Memes
            </ChakraLink>
          </Flex>

          <Flex direction='column'>
            <Text mb='10px'>Community</Text>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              mb='5px'
              href='https://discord.gg/AXwXHGsTaJ'
              isExternal
            >
              Discord
            </ChakraLink>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              mb='5px'
              href='https://twitter.com/reflexerfinance'
              isExternal
            >
              Twitter
            </ChakraLink>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              mb='5px'
              href='https://medium.com/reflexer-labs'
              isExternal
            >
              Medium
            </ChakraLink>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              href='https://community.reflexer.finance/'
              isExternal
            >
              Forum
            </ChakraLink>
          </Flex>

          <Flex direction='column'>
            <Text mb='10px'>General</Text>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              mb='5px'
              href='https://reflexer.finance/faq'
              isExternal
            >
              FAQ
            </ChakraLink>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              mb='5px'
              href='https://immunefi.com/bounty/rai'
              isExternal
            >
              Bug Bounty
            </ChakraLink>
            <ChakraLink
              opacity='0.7'
              fontSize='14px'
              mb='5px'
              href='https://reflexer.finance/privacy'
              isExternal
            >
              Privacy Policy
            </ChakraLink>
          </Flex>
        </SimpleGrid>
      </Flex>

      <Text fontSize='12px' my='10px'>
        © GEB Foundation 2023
      </Text>
    </Flex>
  );
};
