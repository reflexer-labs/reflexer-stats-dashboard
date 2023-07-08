import React, { Component, createContext } from 'react';

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    // safes data
    zeroSafes: [],
    nonZeroSafes: [],

    zeroSafesStored: false,
    nonZeroSafesStored: false,

    // standard stats
    safeCount: '',
    activeSafesCount: '',
    globalDebt: '',
    raiRedemptionPrice: '',
    raiRedemptionRate: '',
    globalCollateral: '',
    collateralPrice: '',
    raiMarketPrice: '',
    liquidationCRatio: '',
    liquidationPrice: ''
  };

  setStandardStats = (
    safeCount,
    activeSafesCount,
    globalDebt,
    raiRedemptionPrice,
    raiRedemptionRate,
    globalCollateral,
    collateralPrice,
    raiMarketPrice,
    liquidationCRatio,
    liquidationPrice
  ) => {
    this.setState({
      safeCount,
      activeSafesCount,
      globalDebt,
      raiRedemptionPrice,
      raiRedemptionRate,
      globalCollateral,
      collateralPrice,
      raiMarketPrice,
      liquidationCRatio,
      liquidationPrice
    });
  };

  setZeroSafes = (_safes) => {
    this.setState({
      zeroSafes: _safes
    });
  };

  setNonZeroSafes = (_safes) => {
    this.setState({
      nonZeroSafes: _safes
    });
  };

  setSystemStates = (_systemStates) => {
    this.setState({
      systemStates: _systemStates
    });
  };

  setZeroSafesStored = (_bool) => {
    this.setState({
      zeroSafesStored: _bool
    });
  };

  setNonZeroSafesStored = (_bool) => {
    this.setState({
      nonZeroSafesStored: _bool
    });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          setStandardStats: this.setStandardStats,
          setZeroSafes: this.setZeroSafes,
          setNonZeroSafes: this.setNonZeroSafes,
          setZeroSafesStored: this.setZeroSafesStored,
          setNonZeroSafesStored: this.setNonZeroSafesStored
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
