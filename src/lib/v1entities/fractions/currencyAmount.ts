import { currencyEquals } from '../token.js'
import { Currency, CNATIVE } from '../currency.js'
import invariant from 'tiny-invariant'

import { BigintIsh, Rounding } from '../../constants/index.js'
import { parseBigintIsh } from '../../lib/ethers/index.js'
import { Fraction } from './fraction.js'

export class CurrencyAmount extends Fraction {
  public readonly currency: Currency

  /**
   * Helper that calls the constructor with the CNATIVE currency
   * @param chainId the chain on which the CNATIVE exists
   * @param rawAmount CNATIVE amount in wei
   */
  public static ether(chainId: number, amount: BigintIsh): CurrencyAmount {
    return new CurrencyAmount(CNATIVE.onChain(chainId), amount)
  }

  // amount _must_ be raw, i.e. in the native representation
  protected constructor(currency: Currency, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)
    // validateSolidityTypeInstance(parsedAmount, SolidityType.uint256)

    super(parsedAmount, 10n ** BigInt(currency.decimals))
    this.currency = currency
  }

  public get raw(): bigint {
    return this.numerator
  }

  public add(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, this.raw + other.raw)
  }

  public subtract(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, this.raw - other.raw)
  }

  public toSignificant(
    significantDigits = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }
}
