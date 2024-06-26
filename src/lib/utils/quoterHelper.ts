import { Client } from '@massalabs/massa-web3'
import { PairV2, RouteV2, TradeV2 } from '../v2entities/index.js'
import {
  Token,
  TokenAmount,
  USDC as _USDC,
  DAI as _DAI,
  WETH as _WETH,
  WMAS as _WMAS
} from '../v1entities/index.js'
import { ChainId } from '../constants/index.js'

export class QuoterHelper {
  static async findBestPath(
    inputToken: Token,
    isNativeIn: boolean,
    outputToken: Token,
    isNativeOut: boolean,
    amount: TokenAmount,
    isExactIn: boolean,
    maxHops: number,
    baseClient: Client,
    CHAIN_ID: ChainId
  ) {
    const BASES: Token[] = [
      _WMAS[CHAIN_ID],
      _USDC[CHAIN_ID],
      _WETH[CHAIN_ID],
      _DAI[CHAIN_ID]
    ]

    // get all [Token, Token] combinations
    const allTokenPairs = PairV2.createAllTokenPairs(
      inputToken,
      outputToken,
      BASES
    )

    // get pairs
    const allPairs = PairV2.initPairs(allTokenPairs)

    // routes to consider in finding the best trade
    const allRoutes = RouteV2.createAllRoutes(
      allPairs,
      inputToken,
      outputToken,
      maxHops
    )

    const trades = await (isExactIn
      ? TradeV2.getTradesExactIn
      : TradeV2.getTradesExactOut)(
      allRoutes,
      amount,
      isExactIn ? outputToken : inputToken,
      isNativeIn,
      isNativeOut,
      baseClient,
      CHAIN_ID
    )

    const filteredTrades = trades.filter(
      (trade): trade is TradeV2 => trade !== undefined
    )
    return TradeV2.chooseBestTrade(filteredTrades, isExactIn)
  }
}
