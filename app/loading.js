'use client';

import { Flex, Spinner } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Flex minH='300px' alignItems='center' justifyContent='center'>
      <Spinner size='xl' />
    </Flex>
  );
}
