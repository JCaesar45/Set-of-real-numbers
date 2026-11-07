from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class Interval:
    low: float
    high: float
    range_type: int  # 0 CLOSED, 1 BOTH_OPEN, 2 LEFT_OPEN, 3 RIGHT_OPEN

    def contains(self, x: float) -> bool:
        low_inc = self.range_type in (0, 3)
        high_inc = self.range_type in (0, 2)
        low_ok = x >= self.low if low_inc else x > self.low
        high_ok = x <= self.high if high_inc else x < self.high
        return low_ok and high_ok


def real_set(a: Interval, b: Interval, operation: str,
             values: Iterable[float]) -> list[bool]:
    def check(x: float) -> bool:
        ia, ib = a.contains(x), b.contains(x)
        if operation == "union":
            return ia or ib
        if operation == "intersect":
            return ia and ib
        if operation == "subtract":
            return ia and not ib
        raise ValueError(f"unknown operation: {operation}")

    return [check(float(v)) for v in values]


if __name__ == "__main__":
    A = Interval(0, 1, 2)   # (0, 1]
    B = Interval(0, 2, 3)   # [0, 2)
    print(real_set(A, B, "union", [1, 2, 3]))  # [True, False, False]

    A = Interval(0, 3, 3)   # [0, 3)
    B = Interval(0, 1, 0)   # [0, 1]
    print(real_set(A, B, "subtract", [0, 1, 2]))  # [False, False, True]
