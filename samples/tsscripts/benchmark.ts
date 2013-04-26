// Copyright (c) 2010-2011 Turbulenz Limited

interface BenchmarkParameters
{
    name: string;
    targetMean: number;

    destroy: () => void;
    isWaiting: () => bool;
    init: () => void;
    run: () => void;

    estimateCount: number;
    estimateStartTime: number;
    estimatedRuns: number;

    // internal
    targetRuns?: number;
};

//
//  Benchmark Framework
//
class BenchmarkFramework
{
    version = 1.1;

    tests: BenchmarkParameters[];
    testExecutionTime: number;
    tz: TurbulenzEngine;
    yieldTimeout: number;
    estimateElapsed: number;

    register(params: BenchmarkParameters)
    {
        var tests = this.tests;
        var floor = Math.floor;
        var testExecutionTime = this.testExecutionTime;

        // TODO: Check parameters are correctly formed
        var targetMean = params.targetMean;
        if (!targetMean)
        {
            // We don't know how long this test is supposed to take, compare how many runs are made
            targetMean = 0;
        }

        params.targetRuns = (targetMean === 0) ? 1 : floor(testExecutionTime / targetMean);
        tests[tests.length] = params;
    };

    setTZ(tz)
    {
        this.tz = tz;
    };

    nextEstimateTest(index)
    {
        var tests = this.tests;
        var test = tests[index];
        var estimateCount = test.estimateCount;
        var startTime = test.estimateStartTime;
        var endTime = this.getBenchmarkTime();

        if (endTime > (startTime + this.estimateElapsed))
        {
            var deltaTime = endTime - startTime;
            var floor = Math.floor;

            test.estimatedRuns = floor((this.testExecutionTime * estimateCount) / deltaTime) || 1;
            return;
        }
        else
        {
            this.runEstimateTest(index);
        }
    };

    runEstimateTest(index)
    {
        var that = this;
        var tests = this.tests;
        var test = tests[index];

        function finishTest()
        {
            test.destroy();

            test.estimateCount += 1;

            that.yieldBenchmark(function nextEstimateTestCallback() {
                var testIndex = index;
                var next = that.nextEstimateTest;
                next.call(that, testIndex);
            });
        }

        function waitForTest()
        {
            if (test.isWaiting())
            {
                that.yieldBenchmark(waitForTest);
            }
            else
            {
                finishTest();
            }
        }

        // Test steps
        test.init();

        this.flush();

        test.run();

        if (test.isWaiting)
        {
            waitForTest();
        }
        else
        {
            finishTest();
        }
    };

    startEstimateRuns(index)
    {
        var tests = this.tests;
        var test = tests[index];
        var yieldBenchmark = this.yieldBenchmark;

        if (!test)
        {
            return false;
        }

        test.estimateStartTime = this.getBenchmarkTime();
        test.estimateCount = 0;

        yieldBenchmark(this.runEstimateTest(index));

        return true;
    };

    hasFinishedEstimate(index)
    {
        var tests = this.tests;
        if (index < 0)
        {
            return false;
        }
        return (tests[index].estimatedRuns !== undefined);
    };

    hasFinishedAllEstimates()
    {
        var tests = this.tests;
        var length = tests.length;
        for (var i = 0; i < length; i += 1)
        {
            if (tests[i].estimatedRuns === undefined)
            {
                return false;
            }
        }
        return true;
    };

    clearAllEstimates()
    {
        var tests = this.tests;
        var length = tests.length;
        for (var i = 0; i < length; i += 1)
        {
            tests[i].estimatedRuns = undefined;
        }
    };

    yieldBenchmark(callback)
    {
        var tz = this.tz;
        var yieldTimeout = this.yieldTimeout;
        if (tz)
        {
            tz.setTimeout(callback, yieldTimeout);
        }
    };

    flush()
    {
        // Clean any memory and force garbage collection
        var tz = this.tz;
        if (tz)
        {
            tz.flush();
        }
    };

    getBenchmarkTime()
    {
        var tz = this.tz;
        //Note: Only use for calculating relative time in seconds
        return (tz ? tz.time : (new Date().getTime() / 1000));
    };

    findTestIndex(name)
    {
        var tests = this.tests;
        var length = tests.length;
        for (var i = 0; i < length; i += 1)
        {
            var testName = tests[i].name;
            if (testName)
            {
                if (testName === name)
                {
                    return i;
                }
            }
        }
        return undefined;
    };

    getTestCount()
    {
        return (this.tests.length);
    };

    // Constructor function
    static create(params): BenchmarkFramework
    {
        var b = new BenchmarkFramework();
        b.tests = [];
        b.testExecutionTime = params.testExecutionTime || 1; // Seconds
        b.tz = null;
        b.yieldTimeout = params.yieldTimeout; // Milliseconds
        b.estimateElapsed = params.estimateElapsed; // Seconds
        return b;
    };
};