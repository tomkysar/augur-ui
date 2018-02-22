import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addOpenOrderTransactions } from 'modules/transactions/actions/add-transactions'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { updateOrderBook } from 'modules/bids-asks/actions/update-order-book'

export const loadAccountOrders = (options, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.trading.getOrders({ ...options, creator: loginAccount.address, universe: universe.id }, (err, orders) => {
    if (err) return callback(err)
    if (orders == null || Object.keys(orders).length === 0) return callback(null)
    const marketIds = Object.keys(orders)
    // TODO: consolidate all the getting of maket infos for load account history
    dispatch(loadMarketsInfo(marketIds, () => {
      dispatch(addOpenOrderTransactions(orders))
      marketIds.forEach((marketId, id) => {
        const outcomes = Object.keys(orders[marketId])
        outcomes.forEach((outcome, id, nextOutcome) => {
          const orderTypeLabels = Object.keys(orders[marketId][outcome])
          orderTypeLabels.forEach(orderTypeLabel => dispatch(updateOrderBook({
            marketId,
            outcome,
            orderTypeLabel,
            orderBook: orders[marketId][outcome][orderTypeLabel]
          })))
        })
      })
      callback(null, orders)
    }))
  })
}
