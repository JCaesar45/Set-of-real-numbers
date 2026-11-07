function realSet(set1, set2, operation, values) {
    // Helper: check if a value is in a single interval
    function inInterval(x, set) {
        const { low, high, rangeType } = set;
        
        // Determine if low is included
        const lowIncluded = (rangeType === 0 || rangeType === 3); // CLOSED or RIGHT_OPEN
        // Determine if high is included  
        const highIncluded = (rangeType === 0 || rangeType === 2); // CLOSED or LEFT_OPEN
        
        const lowCheck = lowIncluded ? x >= low : x > low;
        const highCheck = highIncluded ? x <= high : x < high;
        
        return lowCheck && highCheck;
    }
    
    // Helper: get endpoints and inclusion for an interval
    function getEndpoints(set) {
        const { low, high, rangeType } = set;
        return {
            low,
            high,
            lowIncluded: (rangeType === 0 || rangeType === 3),
            highIncluded: (rangeType === 0 || rangeType === 2)
        };
    }
    
    // Helper: create interval from endpoints
    function makeInterval(low, high, lowIncluded, highIncluded) {
        if (low > high) return null;
        if (low === high && (!lowIncluded || !highIncluded)) return null;
        
        let rangeType;
        if (lowIncluded && highIncluded) rangeType = 0;
        else if (!lowIncluded && !highIncluded) rangeType = 1;
        else if (!lowIncluded && highIncluded) rangeType = 2;
        else rangeType = 3;
        
        return { low, high, rangeType };
    }
    
    // Get all boundary points from both sets
    function getAllBoundaries(s1, s2) {
        const points = new Set();
        points.add(s1.low); points.add(s1.high);
        points.add(s2.low); points.add(s2.high);
        return [...points].sort((a, b) => a - b);
    }
    
    // Build result as list of intervals by sampling between boundaries
    function computeResult() {
        const boundaries = getAllBoundaries(set1, set2);
        const resultIntervals = [];
        
        // Check each segment between consecutive boundaries
        // Also need to check the boundary points themselves
        // Use a fine approach: sample midpoints and endpoints
        
        // Collect all critical points: boundaries and midpoints between them
        const testPoints = [];
        for (let i = 0; i < boundaries.length; i++) {
            testPoints.push(boundaries[i]);
            if (i < boundaries.length - 1) {
                testPoints.push((boundaries[i] + boundaries[i+1]) / 2);
            }
        }
        
        // For each test point, determine membership
        const membership = testPoints.map(pt => {
            const in1 = inInterval(pt, set1);
            const in2 = inInterval(pt, set2);
            let inResult;
            if (operation === "union") inResult = in1 || in2;
            else if (operation === "intersect") inResult = in1 && in2;
            else if (operation === "subtract") inResult = in1 && !in2;
            return { pt, inResult };
        });
        
        // Now build intervals from consecutive test points that are in result
        // We need to handle open/closed boundaries properly
        // For simplicity, let's directly check membership for each query value
        // by determining the result set structure
        
        return membership;
    }
    
    // Actually, for checking specific values, we just need point membership
    // But we need to handle the boundary cases correctly
    
    // The issue: testing only at sample points misses boundary inclusion
    // Better approach: directly determine membership using interval logic
    
    // Let me reconsider: for each query value, directly check
    // if it's in the result set
    
    function isInResult(x) {
        const in1 = inInterval(x, set1);
        const in2 = inInterval(x, set2);
        if (operation === "union") return in1 || in2;
        if (operation === "intersect") return in1 && in2;
        if (operation === "subtract") return in1 && !in2;
        return false;
    }
    
    // Wait — but for union of disjoint sets like [0,1) ∪ (2,3],
    // point membership works fine! We don't need to represent the
    // result as intervals — we just need to check each value.
    
    return values.map(v => isInResult(v));
}
