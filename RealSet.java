import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public final class RealSet {

    public enum RangeType { CLOSED, BOTH_OPEN, LEFT_OPEN, RIGHT_OPEN }

    public static final class Interval {
        public final double low;
        public final double high;
        public final RangeType rangeType;

        public Interval(double low, double high, RangeType rangeType) {
            this.low = low;
            this.high = high;
            this.rangeType = rangeType;
        }

        public boolean contains(double x) {
            boolean lowInc  = rangeType == RangeType.CLOSED || rangeType == RangeType.RIGHT_OPEN;
            boolean highInc = rangeType == RangeType.CLOSED || rangeType == RangeType.LEFT_OPEN;
            boolean lowOk  = lowInc  ? x >= low  : x > low;
            boolean highOk = highInc ? x <= high : x < high;
            return lowOk && highOk;
        }
    }

    public static List<Boolean> realSet(Interval a, Interval b, String op, double[] values) {
        return Arrays.stream(values).mapToObj(x -> {
            boolean ia = a.contains(x);
            boolean ib = b.contains(x);
            switch (op) {
                case "union":     return ia || ib;
                case "intersect": return ia && ib;
                case "subtract":  return ia && !ib;
                default: throw new IllegalArgumentException("unknown operation: " + op);
            }
        }).collect(Collectors.toList());
    }

    public static void main(String[] args) {
        Interval A = new Interval(0, 1, RangeType.LEFT_OPEN);
        Interval B = new Interval(0, 2, RangeType.RIGHT_OPEN);
        System.out.println(realSet(A, B, "union", new double[]{1, 2, 3}));
        // [true, false, false]
    }
}
