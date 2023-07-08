'use client';

import { Flex, Text, Button } from '@chakra-ui/react';
import { GrPrevious, GrNext } from 'react-icons/gr';

export const PageNumbers = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <Flex
      w='100%'
      direction='row'
      alignItems='center'
      justifyContent='end'
      mt='1rem'
    >
      <Button
        isDisabled={currentPage <= 1}
        onClick={() => setCurrentPage((currentPage) => currentPage - 1)}
        fontSize='10px'
        padding='10px'
        height='auto'
        background='#3ac1b9'
        color='black'
        fontWeight='light'
        _hover={{ opacity: 0.7 }}
      >
        <GrPrevious />
      </Button>
      {totalPages > 0 && (
        <Text mx='14px' fontSize='12px' opacity='0.7' textTransform='uppercase'>
          Page {currentPage} of {totalPages}
        </Text>
      )}
      <Button
        isDisabled={currentPage >= totalPages}
        onClick={() => setCurrentPage((currentPage) => currentPage + 1)}
        fontSize='10px'
        padding='10px'
        height='auto'
        background='#3ac1b9'
        color='black'
        fontWeight='light'
        _hover={{ opacity: 0.7 }}
      >
        <GrNext />
      </Button>
    </Flex>
  );
};
