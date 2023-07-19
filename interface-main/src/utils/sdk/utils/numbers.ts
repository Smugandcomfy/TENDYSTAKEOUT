import numbro from "numbro";
import _Decimal from "decimal.js-light";
import toFormat from "toformat";

const Decimal = toFormat(_Decimal);

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP,
};

export function toSignificant(
  num: number | string,
  significantDigits: number = 6,
  format: object = { groupSeparator: "" },
  rounding: Rounding = Rounding.ROUND_HALF_UP
): string {
  Decimal.set({
    precision: significantDigits + 1,
    rounding: toSignificantRounding[rounding],
  });

  const quotient = new Decimal(num).toSignificantDigits(significantDigits);
  return quotient.toFormat(quotient.decimalPlaces(), format);
}

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | string | undefined, digits = 2, round = true) => {
  let _num = num;
  if (_num === 0 || _num === "0") return "$0.00";
  if (!_num) return "-";

  if (_num < 0.01) {
    return `$${toSignificant(_num, digits)}`;
  }

  return numbro(_num).formatCurrency({
    average: round,
    mantissa: _num > 1000 ? 2 : digits,
    abbreviations: {
      million: "M",
      billion: "B",
    },
  });
};

// using a currency library here in case we want to add more in future
export const formatAmount = (num: number | undefined, digits = 2) => {
  if (num === 0) return "0";
  if (!num) return "-";
  if (num < 0.001) {
    return "<0.001";
  }
  return numbro(num).format({
    average: true,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: "M",
      billion: "B",
    },
  });
};
