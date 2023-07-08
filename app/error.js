'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { TbError404 } from 'react-icons/tb';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Flex
      direction='column'
      minH='300px'
      alignItems='center'
      justifyContent='center'
    >
      <Text fontSize='48px' mb='2rem'>
        <TbError404 />
      </Text>
      <Text fontSize='24px' opacity='0.7'>
        Safe Not Found
      </Text>
    </Flex>
  );
}
