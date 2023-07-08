'use client';

import {
  Flex,
  Image as ChakraImage,
  Input,
  Button,
  HStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const [safeId, setSafeId] = useState('');
  const router = useRouter();

  return (
    <Flex
      direction={{ lg: 'row', sm: 'column' }}
      alignItems='center'
      justifyContent='space-between'
      mb='2rem'
    >
      <ChakraImage
        src='/brand-white.png'
        alt='Reflexer Finance'
        w={{ lg: '200px', sm: '100px' }}
        cursor='pointer'
        onClick={() => router.push('/')}
      />
      <HStack mt={{ lg: 0, sm: '2rem' }}>
        <Input
          onChange={(e) => setSafeId(e.target.value)}
          placeholder='safe id'
          onKeyDown={(event) => {
            if (event.key == 'Enter') router.push(`/safe/${safeId}`);
          }}
        />
        <Button
          background='#3ac1b9'
          color='black'
          fontWeight='light'
          _hover={{ opacity: 0.7 }}
          onClick={() => router.push(`/safe/${safeId}`)}
        >
          Search
        </Button>
      </HStack>
    </Flex>
  );
};
