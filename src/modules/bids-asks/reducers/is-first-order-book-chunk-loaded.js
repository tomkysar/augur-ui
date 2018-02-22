import { UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED } from 'modules/bids-asks/actions/update-order-book'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (isFirstOrderBookChunkLoaded = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_IS_FIRST_ORDER_BOOK_CHUNK_LOADED: {
      const {
        marketId,
        outcome,
        orderTypeLabel,
        isLoaded,
      } = action.data
      return {
        ...isFirstOrderBookChunkLoaded,
        [marketId]: {
          ...(isFirstOrderBookChunkLoaded[marketId] || {}),
          [outcome]: {
            ...((isFirstOrderBookChunkLoaded[marketId] || {})[outcome] || {}),
            [orderTypeLabel]: isLoaded
          }
        }
      }
    }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return isFirstOrderBookChunkLoaded
  }
}
