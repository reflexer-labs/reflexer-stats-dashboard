'use client';

import { ActivityTable } from '@/app/components/ActivityTable';
import {
  Flex,
  Text,
  SimpleGrid,
  Skeleton,
  VStack,
  Button,
  HStack,
  Link as ChakraLink
} from '@chakra-ui/react';
import { GrPrevious } from 'react-icons/gr';
import { SAFE_QUERY } from '@/app/utils/queries';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import {
  getAccountString,
  formatNumber,
  getLTVRatio,
  getLiquidationPrice
} from '@/app/utils/helpers';
import { useState, useEffect } from 'react';

export default function SafePage({ params }) {
  const { data: safeData } = useQuery(SAFE_QUERY, {
    variables: { id: params.safeId }
  });

  const [raiRedemptionPrice, setRaiRedemptionPrice] = useState(1);
  const [safe, setSafe] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (safeData) {
      setSafe(safeData.safes[0]);
      setRaiRedemptionPrice(safeData.dailyStats[0].redemptionPrice.value);
    }
  }, [safeData]);

  return (
    <Flex direction='column'>
      <Flex
        direction={{ lg: 'row', sm: 'column' }}
        alignItems={{ lg: 'center', sm: 'flex-start' }}
        justifyContent='space-between'
        mb='2rem'
        p='1rem'
      >
        <HStack fontSize={{ lg: '36px', sm: '24px' }} mb='10px'>
          <Button
            background='#3ac1b9'
            color='black'
            fontWeight='light'
            _hover={{ opacity: 0.7 }}
            onClick={() => router.back()}
            mr='1rem'
          >
            <GrPrevious />
          </Button>
          {!safe ? (
            <Skeleton w='200px' h='16px' />
          ) : (
            <Text
              background='linear-gradient(to right, #41c1d0, #1a6c51)'
              backgroundClip='text'
              fontWeight='extrabold'
            >
              Safe # {safe.safeId}
            </Text>
          )}
        </HStack>
        <SimpleGrid columns={{ lg: 2, sm: 1 }} gap='2'>
          {!safe ? (
            <Skeleton w='200px' h='16px' />
          ) : (
            <HStack>
              <ChakraLink
                href={`https://etherscan.io/address/${safe.owner.address}`}
                isExternal
                bg='#0784c3'
                color='white'
                borderRadius='5px'
                py='5px'
                px='10px'
                fontSize={{ lg: '14px', sm: '12px' }}
                textDecoration='none'
                _hover={{
                  opacity: 0.7
                }}
              >
                Owned by {getAccountString(safe.owner.address)}
              </ChakraLink>
            </HStack>
          )}
          {!safe ? (
            <Skeleton w='200px' h='16px' />
          ) : (
            <HStack>
              <ChakraLink
                href={`https://app.reflexer.finance/#/safes/${safe.safeId}`}
                isExternal
                bg='#3ac1b9'
                color='black'
                borderRadius='5px'
                py='5px'
                px='10px'
                fontSize={{ lg: '14px', sm: '12px' }}
                textDecoration='none'
                _hover={{
                  opacity: 0.7
                }}
              >
                View in dapp
              </ChakraLink>
            </HStack>
          )}
        </SimpleGrid>
      </Flex>

      <Flex direction='row' p='1rem' mb={{ lg: '3rem', sm: '1rem' }}>
        <Flex direction='column'>
          <SimpleGrid columns={{ lg: 2, sm: 2 }} gap='10' mb='2rem'>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Collateral</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <Flex direction='column'>
                  <HStack alignItems='baseline'>
                    <Text
                      background='linear-gradient(to right, #41c1d0, #1a6c51)'
                      backgroundClip='text'
                      fontWeight='extrabold'
                      fontSize={{ lg: '32px', sm: '16px' }}
                    >
                      {new Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2
                      }).format(Number(formatNumber(safe.collateral)))}
                    </Text>
                    <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                      ETH
                    </Text>
                  </HStack>
                  <HStack alignItems='baseline'>
                    <Text color='white' fontSize={{ lg: '18px', sm: '12px' }}>
                      ${' '}
                      {Number(
                        formatNumber(
                          safe.collateral *
                            safe.collateralType.currentPrice.value
                        )
                      ).toLocaleString('en-US')}
                    </Text>
                  </HStack>
                </Flex>
              )}
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Debt</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <Flex direction='column'>
                  <HStack alignItems='baseline'>
                    <Text
                      background='linear-gradient(to right, #41c1d0, #1a6c51)'
                      backgroundClip='text'
                      fontWeight='extrabold'
                      fontSize={{ lg: '32px', sm: '16px' }}
                    >
                      {new Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2
                      }).format(
                        Number(
                          formatNumber(
                            safe.debt * safe.collateralType.accumulatedRate
                          )
                        )
                      )}
                    </Text>
                    <Text fontSize={{ lg: '14px', sm: '12px' }} opacity='0.7'>
                      RAI
                    </Text>
                  </HStack>
                  <HStack alignItems='baseline'>
                    <Text color='white' fontSize={{ lg: '18px', sm: '12px' }}>
                      ${' '}
                      {Number(
                        formatNumber(raiRedemptionPrice * safe.debt)
                      ).toLocaleString('en-US')}
                    </Text>
                  </HStack>
                </Flex>
              )}
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'> LTV Ratio</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <Text
                  fontSize={{ lg: '32px', sm: '16px' }}
                  background='linear-gradient(to right, #41c1d0, #1a6c51)'
                  backgroundClip='text'
                  fontWeight='extrabold'
                >
                  {getLTVRatio(
                    safe.collateral,
                    safe.collateralType.currentPrice.value,
                    safe.debt,
                    raiRedemptionPrice
                  )}
                  %
                </Text>
              )}
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'> Collateral Ratio</Text>
              {!safe ? (
                <Skeleton w='100px' h='30px' />
              ) : (
                <Text
                  fontSize={{ lg: '32px', sm: '16px' }}
                  background='linear-gradient(to right, #41c1d0, #1a6c51)'
                  backgroundClip='text'
                  fontWeight='extrabold'
                >
                  {new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  }).format(
                    Number(
                      (safe.collateral *
                        safe.collateralType.currentPrice.value) /
                        (safe.debt *
                          safe.collateralType.accumulatedRate *
                          raiRedemptionPrice)
                    ) * 100
                  )}{' '}
                  %
                </Text>
              )}
            </VStack>
            <VStack alignItems='flex-start' mr='2rem'>
              <Text opacity='0.7'>Current Price</Text>
              {!safe ? (
                <Skeleton w='70px' h='10px' />
              ) : (
                <Text fontSize={{ lg: '18px', sm: '16px' }}>
                  ${' '}
                  {Number(
                    formatNumber(safe.collateralType.currentPrice.value)
                  ).toLocaleString()}
                </Text>
              )}
            </VStack>
            <VStack alignItems='flex-start'>
              <Text opacity='0.7'>Liquidation Price</Text>
              {!safe ? (
                <Skeleton w='70px' h='10px' />
              ) : (
                <Text fontSize={{ lg: '18px', sm: '16px' }}>
                  ${' '}
                  {Number(
                    getLiquidationPrice(
                      safe.collateral,
                      safe.debt * safe.collateralType.accumulatedRate,
                      safe.collateralType.currentPrice.collateral
                        .liquidationCRatio,
                      raiRedemptionPrice
                    )
                  ).toLocaleString('en-US')}
                </Text>
              )}
            </VStack>
          </SimpleGrid>
        </Flex>
      </Flex>

      {safe && (
        <ActivityTable
          safeId={safe.id}
          collateralPrice={safe.collateralType.currentPrice.value}
          debtPrice={raiRedemptionPrice}
        />
      )}
    </Flex>
  );
}
