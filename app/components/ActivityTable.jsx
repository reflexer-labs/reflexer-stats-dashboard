'use client';

import {
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  HStack,
  Tooltip,
  Link as ChakraLink
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { SAFE_ACTIVITY_QUERY } from '../utils/queries';
import {
  formatNumber,
  formatNumberAlphabetical,
  getActivityName,
  getActivityBool,
  getAccountString
} from '../utils/helpers';
import {
  FaInfoCircle,
  FaLongArrowAltUp,
  FaLongArrowAltDown,
  FaArrowsAlt,
  FaArrowsAltV,
  FaExternalLinkSquareAlt
} from 'react-icons/fa';

export const ActivityTable = ({ safeId, collateralPrice, debtPrice }) => {
  const [activity, setActivity] = useState([]);

  const { data, loading } = useQuery(SAFE_ACTIVITY_QUERY, {
    variables: {
      id: safeId
    }
  });

  useEffect(() => {
    if (data) {
      setActivity(data.safe.modifySAFECollateralization);
    }
  }, [data]);

  return (
    <Flex direction='column'>
      <HStack mb='1rem' alignItems='baseline'>
        <Text fontSize={{ lg: '28px', sm: '22px' }}>Activities</Text>
        <Text fontSize={{ lg: '20px', sm: '18px' }} opacity='0.7'>
          (~{activity && activity.length})
        </Text>
      </HStack>

      {!loading && (
        <TableContainer>
          <Table variant='unstyled'>
            <Thead border='2px solid white'>
              <Tr fontSize='18px'>
                <Th textAlign='left'>Type</Th>
                <Th>Collateral Change</Th>
                <Th>Debt Change</Th>
                <Th textAlign='right'>Timestamp</Th>
                <Th>Receipt</Th>
              </Tr>
            </Thead>
            <Tbody>
              {activity.length > 0 &&
                activity.map((records, index) => {
                  return (
                    <Tr key={index} fontSize='14px'>
                      <Td>
                        <HStack
                          color={
                            getActivityBool(
                              records.deltaDebt,
                              records.deltaCollateral
                            ) === 'increase'
                              ? '#98EECC'
                              : getActivityBool(
                                  records.deltaDebt,
                                  records.deltaCollateral
                                ) === 'decrease'
                              ? '#FEA1A1'
                              : getActivityBool(
                                  records.deltaDebt,
                                  records.deltaCollateral
                                ) === '#FEFF86'
                              ? 'white'
                              : '#FEFF86'
                          }
                          fontWeight='bold'
                        >
                          {getActivityBool(
                            records.deltaDebt,
                            records.deltaCollateral
                          ) === 'increase' && <FaLongArrowAltUp />}{' '}
                          {getActivityBool(
                            records.deltaDebt,
                            records.deltaCollateral
                          ) === 'decrease' && <FaLongArrowAltDown />}{' '}
                          {getActivityBool(
                            records.deltaDebt,
                            records.deltaCollateral
                          ) === 'switch' && <FaArrowsAltV />}{' '}
                          {getActivityBool(
                            records.deltaDebt,
                            records.deltaCollateral
                          ) === 'none' && <FaArrowsAlt />}
                          <Text>
                            {getActivityName(
                              records.deltaDebt,
                              records.deltaCollateral
                            )}
                          </Text>
                        </HStack>
                      </Td>
                      <Td>
                        {records.deltaCollateral == 0 ? (
                          <Text> -- </Text>
                        ) : (
                          <Tooltip
                            label={`${new Intl.NumberFormat('en-US', {
                              style: 'decimal',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }).format(
                              Number(formatNumber(records.deltaCollateral))
                            )} ETH / ${new Intl.NumberFormat('en-US', {
                              style: 'decimal',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }).format(
                              Number(
                                formatNumber(
                                  records.deltaCollateral * collateralPrice
                                )
                              )
                            )}`}
                          >
                            <HStack>
                              <FaInfoCircle />
                              <Text>
                                {new Intl.NumberFormat('en-US', {
                                  style: 'decimal',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                }).format(
                                  Number(formatNumber(records.deltaCollateral))
                                )}{' '}
                                ETH / ~ $
                                {formatNumberAlphabetical(
                                  records.deltaCollateral * collateralPrice,
                                  2
                                )}
                              </Text>
                            </HStack>
                          </Tooltip>
                        )}
                      </Td>
                      <Td>
                        {records.deltaDebt == 0 ? (
                          <Text> -- </Text>
                        ) : (
                          <Tooltip
                            label={`${new Intl.NumberFormat('en-US', {
                              style: 'decimal',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }).format(
                              Number(
                                formatNumber(
                                  records.deltaDebt * records.accumulatedRate
                                )
                              )
                            )} RAI / $ ${new Intl.NumberFormat('en-US', {
                              style: 'decimal',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }).format(
                              Number(
                                formatNumber(records.deltaDebt * debtPrice)
                              )
                            )}`}
                          >
                            <HStack>
                              <FaInfoCircle />
                              <Text>
                                {new Intl.NumberFormat('en-US', {
                                  style: 'decimal',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                }).format(
                                  Number(
                                    formatNumber(
                                      records.deltaDebt *
                                        records.accumulatedRate
                                    )
                                  )
                                )}{' '}
                                RAI / ~ $
                                {formatNumberAlphabetical(
                                  records.deltaDebt * debtPrice,
                                  2
                                )}
                              </Text>
                            </HStack>
                          </Tooltip>
                        )}
                      </Td>
                      <Td textAlign='right'>
                        {new Date(Number(records.createdAt) * 1000)
                          .toLocaleString()
                          .toString()
                          .replaceAll('/', '-')}
                      </Td>
                      <Td textAlign='right'>
                        <HStack color='#0784c3'>
                          <FaExternalLinkSquareAlt />
                          <ChakraLink
                            href={`https://etherscan.io/tx/${records.createdAtTransaction}`}
                            isExternal
                            fontSize={{ lg: '14px', sm: '12px' }}
                            textDecoration='none'
                            _hover={{
                              opacity: 0.7
                            }}
                          >
                            {getAccountString(records.createdAtTransaction)}
                          </ChakraLink>
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {loading && (
        <Flex h='200px' mx='auto' alignItems='center' justifyContent='center'>
          <Spinner color='#3ac1b9' />
        </Flex>
      )}
    </Flex>
  );
};
