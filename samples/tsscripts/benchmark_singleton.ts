/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*global BenchmarkFramework: false*/
/*exported BF*/

//
//  Benchmark Framework used as a singleton
//
(function () {
    var params = {
        // Uses 1/10th of the execution time to calculate an estimate of how many runs to peform for that test
        testExecutionTime: 5,       // Seconds
        yieldTimeout: 20,           // Milliseconds
        estimateElapsed: 0.5        // Seconds
    };

    var BF = BenchmarkFramework.create(params);
})();