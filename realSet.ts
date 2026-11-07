export type RangeType = 0 | 1 | 2 | 3;
export type Operation = "union" | "intersect" | "subtract";

export interface Interval {
  low: number;
  high: number;
  rangeType: RangeType;
}

export function inSet(x: number, s: Interval): boolean {
  const lowInc  = s.rangeType === 0 || s.rangeType === 3;
  const highInc = s.rangeType === 0 || s.rangeType === 2;
  const lowOk  = lowInc  ? x >= s.low  : x > s.low;
  const highOk = highInc ? x <= s.high : x < s.high;
  return lowOk && highOk;
}

export function realSet(
  a: Interval,
  b: Interval,
  operation: Operation,
  values: number[]
): boolean[] {
  return values.map((x) => {
    const ia = inSet(x, a);
    const ib = inSet(x, b);
    switch (operation) {
      case "union":     return ia || ib;
      case "intersect": return ia && ib;
      case "subtract":  return ia && !ib;
    }
  });
}

// smoke test
if (require.main === module) {
  const A: Interval = { low: 0, high: 1, rangeType: 2 };
  const B: Interval = { low: 0, high: 2, rangeType: 3 };
  console.log(realSet(A, B, "union", [1, 2, 3])); // [true, false, false]
}
