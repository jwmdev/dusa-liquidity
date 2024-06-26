import { Token } from '../token.js'
import { TokenAmount } from './tokenAmount.js'
import { currencyEquals } from '../token.js'
import invariant from 'tiny-invariant'

import { BigintIsh, Rounding } from '../../constants/index.js'
import { Currency } from '../currency.js'
import { Fraction } from './fraction.js'
import { CurrencyAmount } from './currencyAmount.js'

export class Price extends Fraction {
  public readonly baseCurrency: Currency // input i.e. denominator
  public readonly quoteCurrency: Currency // output i.e. numerator
  public readonly scalar: Fraction // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token

  // denominator and numerator _must_ be raw, i.e. in the native representation
  public constructor(
    baseCurrency: Currency,
    quoteCurrency: Currency,
    denominator: BigintIsh,
    numerator: BigintIsh
  ) {
    super(numerator, denominator)

    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
    this.scalar = new Fraction(
      10n ** BigInt(baseCurrency.decimals),
      10n ** BigInt(quoteCurrency.decimals)
    )
  }

  public get raw(): Fraction {
    return new Fraction(this.numerator, this.denominator)
  }

  public get adjusted(): Fraction {
    return super.multiply(this.scalar)
  }

  public invert(): Price {
    return new Price(
      this.quoteCurrency,
      this.baseCurrency,
      this.numerator,
      this.denominator
    )
  }

  public multiply(other: Price): Price {
    invariant(currencyEquals(this.quoteCurrency, other.baseCurrency), 'TOKEN')
    const fraction = super.multiply(other)
    return new Price(
      this.baseCurrency,
      other.quoteCurrency,
      fraction.denominator,
      fraction.numerator
    )
  }

  // performs floor division on overflow
  public quote(currencyAmount: CurrencyAmount): CurrencyAmount {
    invariant(
      currencyEquals(currencyAmount.currency, this.baseCurrency),
      'TOKEN'
    )
    if (this.quoteCurrency instanceof Token) {
      return new TokenAmount(
        this.quoteCurrency,
        super.multiply(currencyAmount.raw).quotient
      )
    }
    return CurrencyAmount.ether(
      currencyAmount.currency.chainId,
      super.multiply(currencyAmount.raw).quotient
    )
  }

  public toSignificant(
    significantDigits = 6,
    format?: object,
    rounding?: Rounding
  ): string {
    return this.adjusted.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces = 4,
    format?: object,
    rounding?: Rounding
  ): string {
    return this.adjusted.toFixed(decimalPlaces, format, rounding)
  }
}
