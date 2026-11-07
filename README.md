# real-set

A precise implementation of interval algebra over the real line — union,
intersection, and difference — for TypeScript, Python, and Java, plus a
single-file browser demo.

The problem this solves is small and well-defined: represent convex subsets
of ℝ as intervals `[a, b]`, `(a, b)`, `(a, b]`, or `[a, b)`, and answer
membership questions after set operations. It is the kind of thing that
shows up in constraint solvers, scheduling code, and anywhere you find
yourself writing `if (x >= start && x < end)` in three places and getting
two of them wrong.

## What's in the box

- **Demo** — `demo/index.html`, open it in any browser. No build step.
- **TypeScript library** — `ts/`, compiles to ESM + CJS, ships its own types.
- **Python library** — `py/`, zero dependencies, type-hinted.
- **Java library** — `java/`, Java 17+, JUnit 5 tests.

All three libraries expose the same function:

    realSet(A, B, operation, values) -> boolean[]

where `A` and `B` are intervals with `low`, `high`, and `rangeType`, and
`operation` is one of `"union"`, `"intersect"`, `"subtract"`.

## The `rangeType` encoding

| Code | Name       | Notation | Low included | High included |
|------|------------|----------|--------------|---------------|
| 0    | CLOSED     | [a, b]   | yes          | yes           |
| 1    | BOTH_OPEN  | (a, b)   | no           | no            |
| 2    | LEFT_OPEN  | (a, b]   | no           | yes           |
| 3    | RIGHT_OPEN | [a, b)   | yes          | no            |

This encoding is taken directly from the Rosetta Code "Set of real numbers"
task. The names are not intuitive on their own — `LEFT_OPEN` means the left
endpoint is open, which is why it is `(a, b]` and not `[a, b)`. If you are
reading this because you got it backwards: you are not the first, and the
test suite is there for exactly that reason.

## Usage

### TypeScript

```typescript
import { realSet } from "@yourorg/real-set";

const A = { low: 0, high: 1, rangeType: 2 as const }; // (0, 1]
const B = { low: 0, high: 2, rangeType: 3 as const }; // [0, 2)

realSet(A, B, "union", [1, 2, 3]); // [true, false, false]
```

### Python

```python
from real_set import Interval, real_set

A = Interval(0, 1, 2)   # (0, 1]
B = Interval(0, 2, 3)   # [0, 2)

real_set(A, B, "union", [1, 2, 3])  # [True, False, False]
```

### Java

```java
Interval A = new Interval(0, 1, RangeType.LEFT_OPEN);  // (0, 1]
Interval B = new Interval(0, 2, RangeType.RIGHT_OPEN); // [0, 2)

RealSet.realSet(A, B, "union", new double[]{1, 2, 3});
// [true, false, false]
```

## Design notes

**Why point membership instead of interval construction.** The union of
two intervals is not always an interval: `[0, 1) ∪ (2, 3]` is two disjoint
pieces. Any API that promises to return "the resulting set" as a single
`{low, high, rangeType}` triple is lying about what union does. Point
membership is total, cheap, and correct for every operation. If a future
version needs to return the result as a set, that is a separate function
with a separate return type (a list of intervals), and it should be added
deliberately rather than smuggled into `realSet`.

**Why the `rangeType` integers instead of booleans.** Two booleans
(`lowIncluded`, `highIncluded`) are more honest, but the Rosetta Code task
specifies the integer encoding, and matching the spec means the test suite
can be copied verbatim. The named types in each language (`RangeType` enum
in Java, union literal in TypeScript, `IntEnum` candidate in Python) exist
to prevent the integer from leaking into user code.

## Testing

The test suite is the six worked examples from the Rosetta Code task plus a
few edge cases (`a == b`, empty intervals, values exactly on boundaries).
If you change the semantics, these tests will tell you.

    cd ts && npm test
    cd py && pytest
    cd java && mvn test

## Attribution

The problem statement and the canonical examples come from the Rosetta Code
"Set of real numbers" task (Rosetta Code, n.d.). The implementations here
are independent; the specification is not.

## License

MIT.

---

## References

Rosetta Code. (n.d.). *Set of real numbers*. Retrieved from https://rosettacode.org/wiki/Set_of_real_numbers
