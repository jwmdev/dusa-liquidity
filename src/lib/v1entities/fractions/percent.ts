import { Rounding } from '../../constants/index.js'
import { Fraction } from './fraction.js'

const _100_PERCENT = new Fraction(100n)

export class Percent extends Fraction {
  public toSignificant(
    significantDigits = 5,
    format?: object,
    rounding?: Rounding
  ): string {
    return this.multiply(_100_PERCENT).toSignificant(
      significantDigits,
      format,
      rounding
    )
  }

  public toFixed(
    decimalPlaces = 2,
    format?: object,
    rounding?: Rounding
  ): string {
    return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding)
  }
}
