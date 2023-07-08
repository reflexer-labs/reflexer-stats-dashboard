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
  HStack,
  Tooltip,
  Checkbox,
  CircularProgressLabel,
  Link as ChakraLink,
  VStack,
  CircularProgress
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import { useQuery } from '@apollo/client';
import {
  ALLSAFES_QUERY_NOT_ZERO,
  ALLSAFES_QUERY_WITH_ZERO
} from '../utils/queries';
import { PageNumbers } from './PageNumbers';
import {
  formatNumber,
  formatNumberAlphabetical,
  getAccountString,
  getLiquidationPrice,
  getCollateralRatio,
  getLTVRatio
} from '../utils/helpers';
import {
  FaAngleDown,
  FaAngleUp,
  FaInfoCircle,
  FaExternalLinkSquareAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { RxCrossCircled } from 'react-icons/rx';

import { AppContext } from '../context/AppContext';

const RECORDS_PER_PAGE = 50;

export const SafesTable = () => {
  const router = useRouter();
  const context = useContext(AppContext);

  // table controllers
  const [currentSafes, setCurrentSafes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [graphqlPage, setGraphQlPage] = useState(0);

  // state indicators
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  // state controllers
  const [notZeroSafes, setNotZeroSafes] = useState(true);
  const [sortBy, setSortBy] = useState({
    type: 'collateral',
    direction: 'desc'
  });

  // data controller
  const { fetchMore } = useQuery(
    notZeroSafes ? ALLSAFES_QUERY_NOT_ZERO : ALLSAFES_QUERY_WITH_ZERO,
    {
      variables: {
        first: RECORDS_PER_PAGE,
        skip: (currentPage - 1) * RECORDS_PER_PAGE,
        orderBy: sortBy.type === 'CR' ? 'collateral' : sortBy.type,
        orderDirection: sortBy.direction
      }
    }
  );

  const performSorts = () => {
    let _safes = [];
    if (sortBy.type === 'CR') {
      _safes = (notZeroSafes ? context.nonZeroSafes : context.zeroSafes)
        .map((safe) => {
          let cr = getCollateralRatio(
            safe.collateral,
            safe.debt,
            safe.collateralType.currentPrice.liquidationPrice,
            safe.collateralType.currentPrice.collateral.liquidationCRatio
          );

          return {
            ...safe,
            CR: cr
          };
        })
        .filter((safe) => safe.CR !== '∞');

      _safes.sort((a, b) => {
        return sortBy.direction === 'asc'
          ? Number(a.CR) - Number(b.CR)
          : Number(b.CR) - Number(a.CR);
      });
    }

    if (sortBy.type === 'collateral') {
      _safes = notZeroSafes ? context.nonZeroSafes : context.zeroSafes;

      _safes.sort((a, b) => {
        return sortBy.direction === 'asc'
          ? Number(a.collateral) - Number(b.collateral)
          : Number(b.collateral) - Number(a.collateral);
      });
    }

    if (sortBy.type === 'debt') {
      _safes = notZeroSafes ? context.nonZeroSafes : context.zeroSafes;

      _safes.sort((a, b) => {
        return sortBy.direction === 'asc'
          ? Number(a.debt) - Number(b.debt)
          : Number(b.debt) - Number(a.debt);
      });
    }

    let _totalPages = Math.ceil(_safes.length / RECORDS_PER_PAGE);
    setTotalPages(_totalPages);

    cropRecords(_safes, currentPage);
    setLoading(false);
  };

  const loadMore = async (_first, _skip) => {
    fetchMore({
      variables: {
        first: _first,
        skip: _skip,
        orderBy: sortBy.type === 'CR' ? 'collateral' : sortBy.type,
        orderDirection: sortBy.direction
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (fetchMoreResult && fetchMoreResult.safes.length > 0) {
          if (notZeroSafes && !context.nonZeroSafesStored) {
            context.setNonZeroSafes([
              ...context.nonZeroSafes,
              ...fetchMoreResult.safes
            ]);
            setProgressPercent(
              ((graphqlPage * 100) / context.activeSafesCount) * 100
            );
          } else if (!notZeroSafes && !context.zeroSafesStored) {
            context.setZeroSafes([
              ...context.zeroSafes,
              ...fetchMoreResult.safes
            ]);
            setProgressPercent(
              ((graphqlPage * 100) /
                fetchMoreResult.safes[0].collateralType.safeCount) *
                100
            );
          }
          setGraphQlPage(graphqlPage + 1);
        } else {
          if (!notZeroSafes) {
            context.setZeroSafesStored(true);
          } else {
            context.setNonZeroSafesStored(true);
          }

          performSorts();
        }
      }
    });
  };

  const paginate = (_safes, _pageNumber) => {
    _pageNumber ? setCurrentPage(_pageNumber) : null;
    const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
    const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
    const currentSafes = _safes.slice(indexOfFirstRecord, indexOfLastRecord);
    setCurrentSafes(currentSafes);
  };

  const cropRecords = (_safes, _page) => {
    setTotalPages(Math.ceil(_safes.length / RECORDS_PER_PAGE));
    paginate(_safes, _page);
  };

  const updateSortBy = (type) => {
    setSortBy((prevState) => ({
      ...prevState,
      type: type,
      direction: prevState.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const updateNotZeroFilter = () => {
    setNotZeroSafes((prevState) => !prevState);
    updateSortBy('collateral');
  };

  useEffect(() => {
    if (!context.zeroSafesStored || !context.nonZeroSafesStored) {
      loadMore(100, graphqlPage * 100);
    }
  }, [graphqlPage]);

  useEffect(() => {
    setLoading(true);
    setCurrentSafes([]);
    performSorts();
    setCurrentPage(1);
  }, [sortBy]);

  useEffect(() => {
    setLoading(true);
    setCurrentSafes([]);
    if (!notZeroSafes && context.zeroSafesStored) {
      performSorts();
    } else if (notZeroSafes && context.nonZeroSafesStored) {
      performSorts();
    } else {
      setGraphQlPage(0);
    }
  }, [notZeroSafes]);

  useEffect(() => {
    if (sortBy.type === 'CR') {
      performSorts();
    } else {
      cropRecords(
        notZeroSafes ? context.nonZeroSafes : context.zeroSafes,
        currentPage
      );
    }
  }, [currentPage]);

  return (
    <Flex direction='column'>
      <HStack alignItems='center' justifyContent='space-between' mb='1rem'>
        <VStack w='100%' alignItems='flex-start'>
          <Text fontSize={{ lg: '28px', sm: '18px' }}>All Safes</Text>
          <Checkbox
            isChecked={notZeroSafes}
            onChange={() => updateNotZeroFilter()}
            size='sm'
            opacity='0.7'
          >
            Hide zero collateral safes
          </Checkbox>
        </VStack>
        {totalPages > 0 && (
          <PageNumbers
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </HStack>

      {!loading && (
        <TableContainer>
          <Table variant='unstyled'>
            <Thead border='2px solid white'>
              <Tr fontSize='18px'>
                <Th textAlign='left'>Safe ID</Th>
                <Th textAlign='left'>Owner</Th>
                <Th
                  textAlign='right'
                  onClick={() => {
                    updateSortBy('debt');
                  }}
                  cursor='pointer'
                  _hover={{
                    opacity: 0.7
                  }}
                >
                  <HStack justifyContent='flex-start'>
                    <Text>Debt</Text>
                    <Flex direction='column'>
                      {sortBy.type === 'debt' ? (
                        sortBy.direction === 'desc' ? (
                          <FaAngleUp />
                        ) : (
                          <FaAngleDown />
                        )
                      ) : (
                        <>
                          <FaAngleUp /> <FaAngleDown />
                        </>
                      )}
                    </Flex>
                  </HStack>
                </Th>
                <Th
                  textAlign='right'
                  onClick={() => updateSortBy('collateral')}
                  cursor='pointer'
                  _hover={{
                    opacity: 0.7
                  }}
                >
                  <HStack justifyContent='flex-start'>
                    <Text>Collateral</Text>
                    <Flex direction='column'>
                      {sortBy.type === 'collateral' ? (
                        sortBy.direction === 'desc' ? (
                          <FaAngleUp />
                        ) : (
                          <FaAngleDown />
                        )
                      ) : (
                        <>
                          <FaAngleUp /> <FaAngleDown />
                        </>
                      )}
                    </Flex>
                  </HStack>
                </Th>
                <Th
                  textAlign='center'
                  onClick={() => {
                    updateSortBy('CR');
                  }}
                  cursor='pointer'
                  _hover={{
                    opacity: 0.7
                  }}
                >
                  <HStack justifyContent='flex-start'>
                    <HStack>
                      <Text>Collateral Ratio</Text>
                      <Flex direction='column'>
                        {sortBy.type === 'CR' ? (
                          sortBy.direction === 'desc' ? (
                            <FaAngleUp />
                          ) : (
                            <FaAngleDown />
                          )
                        ) : (
                          <>
                            <FaAngleUp /> <FaAngleDown />
                          </>
                        )}
                      </Flex>
                    </HStack>
                  </HStack>
                </Th>
                <Th textAlign='left'>Liquidation</Th>
                <Th textAlign='center'>LTV</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentSafes.length > 0 &&
                currentSafes.map((safe, index) => {
                  return (
                    <Tr key={index} fontSize='14px'>
                      <Td>
                        <HStack>
                          <Tooltip
                            label={
                              safe.saviour && safe.saviour.allowed
                                ? 'Saviour Protection Enabled'
                                : 'Saviour Protection Disabled'
                            }
                          >
                            <Text
                              mr='10px'
                              textAlign='center'
                              color={
                                safe.saviour && safe.saviour.allowed
                                  ? 'green'
                                  : 'red'
                              }
                            >
                              {safe.saviour && safe.saviour.allowed ? (
                                <FaCheckCircle />
                              ) : (
                                <RxCrossCircled />
                              )}
                            </Text>
                          </Tooltip>

                          <HStack
                            bg='#3ac1b9'
                            color='black'
                            w='70px'
                            borderRadius='5px'
                            p='5px'
                            fontWeight='bold'
                            _hover={{ opacity: 0.7 }}
                            cursor='pointer'
                            onClick={() => router.push(`/safe/${safe.safeId}`)}
                          >
                            <FaExternalLinkSquareAlt />
                            <Text>{safe.safeId}</Text>
                          </HStack>
                        </HStack>
                      </Td>
                      <Td>
                        <Tooltip
                          label={safe.owner.address}
                          placement='right'
                          fontSize='14px'
                        >
                          <HStack color='#0784c3'>
                            <FaInfoCircle />
                            <ChakraLink
                              href={`https://etherscan.io/address/${safe.owner.address}`}
                              isExternal
                            >
                              {getAccountString(safe.owner.address)}
                            </ChakraLink>
                          </HStack>
                        </Tooltip>
                      </Td>

                      <Td color='#3ac1b9'>
                        <Tooltip
                          label={` ${new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(
                            Number(formatNumber(safe.debt))
                          )} RAI / $ ${new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(
                            Number(
                              formatNumber(safe.debt * context.raiMarketPrice)
                            )
                          )}`}
                          placement='right'
                          fontSize='14px'
                        >
                          <HStack>
                            <FaInfoCircle />
                            <Text>
                              {new Intl.NumberFormat('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(Number(formatNumber(safe.debt)))}{' '}
                              RAI / ~ $
                              {formatNumberAlphabetical(
                                safe.debt * context.raiMarketPrice
                              )}
                            </Text>
                          </HStack>
                        </Tooltip>
                      </Td>

                      <Td>
                        <Tooltip
                          label={`${new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(
                            Number(formatNumber(safe.collateral))
                          )} ETH / $ ${new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(
                            Number(
                              formatNumber(
                                safe.collateral * context.collateralPrice
                              )
                            )
                          )}`}
                          placement='right'
                          fontSize='14px'
                        >
                          <HStack>
                            <FaInfoCircle />
                            <Text>
                              {new Intl.NumberFormat('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(Number(formatNumber(safe.collateral)))}
                              ETH / ~ $
                              {formatNumberAlphabetical(
                                safe.collateral * context.collateralPrice
                              )}
                            </Text>
                          </HStack>
                        </Tooltip>
                      </Td>

                      <Td textAlign='center'>
                        {getCollateralRatio(
                          safe.collateral,
                          safe.debt,
                          safe.collateralType.currentPrice.liquidationPrice,
                          safe.collateralType.currentPrice.collateral
                            .liquidationCRatio
                        )}{' '}
                        %
                      </Td>
                      <Td textAlign='left'>
                        $
                        {Number(
                          getLiquidationPrice(
                            safe.collateral,
                            safe.debt * safe.collateralType.accumulatedRate,
                            safe.collateralType.currentPrice.collateral
                              .liquidationCRatio,
                            context.raiRedemptionPrice
                          )
                        ).toLocaleString('en-US')}
                      </Td>
                      <Td textAlign='center'>
                        {getLTVRatio(
                          safe.collateral,
                          context.collateralPrice,
                          safe.debt,
                          context.raiMarketPrice
                        )}{' '}
                        %
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {loading && (
        <Flex
          flexDirection='column'
          h='500px'
          mx='auto'
          alignItems='center'
          justifyContent='center'
        >
          <CircularProgress
            value={progressPercent}
            size='50px'
            color='#3ac1b9'
            thickness='4px'
            mb='1rem'
          >
            <CircularProgressLabel>
              {Math.round(progressPercent)} %
            </CircularProgressLabel>
          </CircularProgress>
          <Text fontSize='xs'>
            Data is loaded only upon start up. Please wait.
          </Text>
        </Flex>
      )}

      {totalPages > 0 && (
        <PageNumbers
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Flex>
  );
};
