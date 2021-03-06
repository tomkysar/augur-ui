import store from "src/store";
import { constants } from "services/augurjs";

function filterForkedMarket(market) {
  const { universe } = store.getState();
  return !(
    universe.isForkingMarketFinalized &&
    universe.isForking &&
    universe.forkingMarket === market.id
  );
}

export const selectMarketsToReport = marketsData => {
  const markets = {};
  markets.designated = marketsData
    .filter(
      market =>
        market.reportingState === constants.REPORTING_STATE.DESIGNATED_REPORTING
    )
    .sort((a, b) => (a.endTime || {}).timestamp - (b.endTime || {}).timestamp);
  markets.open = marketsData
    .filter(
      market =>
        market.reportingState === constants.REPORTING_STATE.OPEN_REPORTING
    )
    .sort((a, b) => (a.endTime || {}).timestamp - (b.endTime || {}).timestamp);
  markets.upcoming = marketsData
    .filter(
      market =>
        market.reportingState === constants.REPORTING_STATE.PRE_REPORTING &&
        filterForkedMarket(market)
    )
    .sort((a, b) => (a.endTime || {}).timestamp - (b.endTime || {}).timestamp);

  return markets;
};
