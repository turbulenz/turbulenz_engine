/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*global TurbulenzEngine: true */
/*global BF: true*/
/*global params: true*/

TurbulenzEngine.onload = function onloadFn()
{
    if (!BF)
    {
        window.alert("Could not find the benchmark framework");
        return;
    }

    BF.setTZ(TurbulenzEngine);

    var benchmarkVersion = 1.3;
    // Marks the version of the benchmark to be run. This value is not directly related to the versions of the tests,
    // but should indicate which test version is being used:
    //
    // Benchmark Version (1.3)
    // =======================
    //
    // passing_params:
    // * VariablePass:          1.2
    // * VariableScopeThis:     1.2
    // * VariableScopeOuter:    1.2
    //
    // inline_functions:
    // * InlineFunction:        1.1
    // * NonInlineFunction:     1.1
    //
    // object_array_access:
    // * AccessObjectProperty:  1.1
    // * AccessArrayIndex:      1.1
    //
    // iterate_object_array:
    // * IterateArrayAccess:    1.1
    // * IterateObjectAccess:   1.1
    //
    // indirect_direct_access:
    // * DirectFunctionAccess:  1.0
    // * IndirectFunctionAccess:1.0
    //
    // get_set_properties:
    // * AccessProperty:        1.0
    // * GetSetProperty:        1.0
    //
    // recursive_iterative:
    // * Recursive:             1.0
    // * Iterative:             1.0

    window.$('#version').append('(Version ' + benchmarkVersion + ')');

    // Estimate runs, having set TZ
    var currentIndex = -1;
    var testCount = BF.getTestCount();
    // Auto-runs the estimate when everything is loaded (if true)
    var estimate = false;
    // Quick test: Runs `defaultIterations` number of each test
    var defaultIterations = 5;
    var quickTest = false;

    // Function pointers
    var loadTests, startTests, runEstimateTests, interrupt, runQuickTests, updateTestCount, setState;

    var progressbarTestSrc = "./images/progressbar_small.png";
    var progressbarOverallSrc = "./images/progressbar_large.png";

    // Static list of tests that are comparible
    // TODO: Generate dynamically
    var compareList = [];

    var group = "Turbulenz JavaScript Comparison Benchmarks";
    var defaultScorePerTest = 100; // pts

    var runList = null;
    var runTestCount = 0;
    var runCount = 0;

    var lastTest;
    var lastTestProgress = 0;

    var results = [];
    var totalExecutionTime = 0;

    var inProgress = false;
    var stop = false;
    var pause = false;

    var timeout = params.yieldTimeout;

    var state = {
        uninit : 0,
        init : 1,
        initializing : 2,
        testing : 3,
        benchmarking : 4,
        paused : 5
    };

    var currentState = state.uninit;

    var finish = function finishFn()
    {
        if (((currentState === state.benchmarking) || (currentState === state.testing)) && !stop)
        {
            window.$("#benchmarkcount").html("Benchmarks: Done!");
            window.$("#overallprogressbarimg").css('backgroundPosition', '0px 0px');
        }
        else
        {
            window.$("#benchmarkcount").html("Benchmarks");
            window.$("#overallprogressbarimg").css('backgroundPosition', '-1024px 0px');
        }

        if (!pause)
        {
            quickTest = false;
        }

        if (currentState === state.uninit)
        {
            loadTests();
        }
        else
        {
            updateTestCount();
        }

        currentIndex = -1;

        if (pause && !stop)
        {
            setState(state.paused);
        }
        else
        {
            setState(BF.hasFinishedAllEstimates() ? state.init : state.uninit);
        }
    };

    var updateEstimateTests = function updateEstimateTestsFn(testIndex, testTotal)
    {
        var overallProgress = 500 * (testIndex / testTotal);

        var test = BF.tests[testIndex];
        var name = test.name;

        window.$("#benchmarkcount").html("Initializing: " + name);
        window.$("#overallprogressbarimg").css('backgroundPosition', '-' + (1024 - overallProgress) + 'px 0px');
    };

    var nextEstimateTests = function nextEstimateTestsFn() {
        if (BF.hasFinishedEstimate(currentIndex))
        {
            currentIndex += 1;

            if (currentIndex >= testCount || stop)
            {
                finish();
                return;
            }

            updateEstimateTests(currentIndex, testCount);

            BF.startEstimateRuns(currentIndex);
        }

        runEstimateTests();
    };

    runEstimateTests = function runEstimateTestsFn() {
        if ((currentIndex === -1))
        {
            // Start new estimates
            setState(state.initializing);

            BF.clearAllEstimates();

            currentIndex += 1;
            stop = false;

            BF.startEstimateRuns(currentIndex);
        }

        BF.yieldBenchmark(nextEstimateTests);
    };

    var yieldTest = function yieldTestFn(callback)
    {
        TurbulenzEngine.setTimeout(callback, timeout);
    };

    var findResult = function findResultFn(name)
    {
        var index = BF.findTestIndex(name);
        if (index === undefined || index >= results.length || (!results[index]))
        {
            return undefined;
        }
        return (results[index].mean);
    };

    var generateTests = function generateTestsFn()
    {
        // TODO: use list accessor
        var testCount = BF.tests.length;
        var testList = BF.tests;
        var listItem = null;

        runList = null;
        runCount = 0;
        runTestCount = 0;

        //TODO: Generate per group
        var group = "Turbulenz JavaScript Comparison Benchmarks";
        var benchmarkString = '<h2>' + group + '<\/h2><table>';
        var groupLength = testCount;

        var oddColor = "#888";
        var evenColor = "#555";

        var generateHTML = function generateHTMLFn(name, isOdd)
        {
            benchmarkString += '<tr id="' + name + 'results" style="background-color: ' + (isOdd ? oddColor : evenColor) + '"><td class="resultname" style="background-color: ' + (isOdd ? oddColor : evenColor) + '">';
            benchmarkString += name + '<\/td><td class="resultstatus" style="background-color: ' + (isOdd ? oddColor : evenColor);
            benchmarkString += '">Ready<\/td><td class="resultprogress" style="background-color: ' + (isOdd ? oddColor : evenColor) + '"><\/td><\/tr>';
        };

        for (var i = 0; i < groupLength; i += 1)
        {
            var element = <HTMLInputElement>
                (document.getElementById(group + '_' + i));
            if (element && element.checked)
            {
                var test = testList[i];
                var iterElement = <HTMLInputElement>
                    (document.getElementById(test.name + 'iter'));
                var numOfIterations = parseInt(iterElement.value, 10);

                for (var j = 0; j < numOfIterations; j += 1)
                {
                    var testParams = {
                        testIndex: i,
                        iteration: j + 1,
                        numOfIterations: numOfIterations
                    };

                    if (!runList)
                    {
                        runList = testParams;
                        listItem = testParams;
                    } else
                    {
                        listItem.next = testParams;
                        listItem = listItem.next;
                    }
                    runCount += 1;
                }
                generateHTML(test.name, ((runTestCount % 2) === 1));
                runTestCount += 1;
            }
        }

        if (runTestCount < 1)
        {
            window.alert("No benchmarks are currently selected");
            pause = false;
            finish();
            inProgress = false;
            return;
        }

        document.getElementById("benchmarkcount").innerHTML = "Benchmarks";
        document.getElementById("benchmarklist").innerHTML = benchmarkString + '<\/table><br><div id="benchmarkCompare"><\/div>';
        document.getElementById("results").innerHTML = "";
    };

    var processResult = function processResultFn(testResults)
    {
        var pow = Math.pow;
        var sqrt = Math.sqrt;
        // t-distribution
        // 95% confidence for n-1 = 5
        var dist = 2.571;
        var sum = 0;
        var variance = 0;
        var mean = 0;
        var sd = 0;
        var sem = 0;
        var min = 0;
        var max = 0;
        var error = 0;
        var j;

        var sort = function sortFn(a, b) {
            return a - b;
        };

        var runResults = testResults.run;
        var n = runResults.length;

        if (n > 1)
        {
            for (j = 0; j < n; j += 1)
            {
                sum += runResults[j];
            }
            mean = (sum / n);

            for (j = 0; j < n; j += 1)
            {
                variance += pow((runResults[j] - mean), 2);
            }
            variance /= (n - 1);
            sd = sqrt(variance);

            sem = sd / sqrt(n);
            error = ((sem * dist) / mean) * 100;

            var sortedResults = runResults.slice().sort(sort);

            min = sortedResults[0];
            max = sortedResults[n - 1];
        }
        else if (n === 1)
        {
            mean = runResults[0];
            sum = mean;
        }

        testResults.error = error;
        testResults.min = min;
        testResults.max = max;
        testResults.mean = mean;
        testResults.sum = sum;
        testResults.variance = variance;
        testResults.sd = sd;
        testResults.sem = sem;
    };

    var processResults = function processResultsFn()
    {
        var resultsLength = results.length;
        var testResults;

        for (var i = 0; i < resultsLength; i += 1)
        {
            testResults = results[i];
            if (testResults)
            {
                processResult(testResults);
            }
        }
    };

    var calcScore = function calcScoreFn()
    {
        var length = results.length;
        var testResults, runResults, test;
        var score = 0;
        var testList = BF.tests;
        var floor = Math.floor;

        for (var i = 0; i < length; i += 1)
        {
            testResults = results[i];
            test = testList[i];
            if (testResults)
            {
                runResults = testResults.run;
                if (runResults)
                {
                    var targetScore = test.targetScore || defaultScorePerTest; // The number of points available for mean performance test
                    var meanScore = 0;
                    var testMean = testResults.mean;
                    var targetMean = test.targetMean;

                    // The percentage of those points available from the calculated mean
                    // Variance is added to reduce the points for an inaccurate set of tests

                    meanScore = targetScore * (targetMean / (testMean + testResults.variance));

                    score += meanScore;
                }
            }
        }

        return floor(score);
    };

    var toggleResults = function toggleResultsFn() {
        var descNode = document.getElementById(this.getAttribute("detailsID"));
        if (descNode)
        {
            var display = descNode.style.display;
            if (display === "block")
            {
                descNode.style.display = "none";
                this.innerHTML = "[Details]";
            }
            else
            {
                descNode.style.display = "block";
                this.innerHTML = "[Simple]";
            }
        }
    };

    var formatTime = function formatTimeFn(timeInSeconds)
    {
        return ((timeInSeconds * 1000).toFixed(2) + " ms");
    };

    var formatError = function formatErrorFn(errorPercent)
    {
        return ("+/- " + errorPercent.toFixed(2) + "%");
    };

    var postResults = function postResultsFn()
    {
        var i, j, ilen, jLen, name;
        var comparisonText = "";
        var testList = BF.tests;
        var testListLength = testList.length;

        var initResults = function initResultsFn()
        {
            var i;
            var divs = document.getElementsByTagName("div");
            var iLen = divs.length;

            for (i = 0; i < iLen; i += 1)
            {
                var test = <HTMLDivElement>(divs[i]);
                if (test.className === "testresults")
                {
                    var j, jLen;
                    var childNodes = test.childNodes;
                    var button = null;
                    var desc = null;

                    jLen = childNodes.length;
                    for (j = 0; j < jLen; j += 1)
                    {
                        var child = <HTMLInputElement>(childNodes[j]);
                        if (child.className === "testdetails")
                        {
                            desc = child;
                        }
                    }

                    if (desc)
                    {
                        button = document.getElementById(desc.id + "expand");
                        if (button)
                        {
                            button.innerHTML = "[Details]";
                            button.setAttribute("detailsID", desc.id);
                            button.onclick = toggleResults;
                            button.style.cursor = 'pointer';
                            desc.style.display = "none";
                        }
                    }
                }
            }
        };

        ilen = testListLength;
        for (i = 0; i < ilen; i += 1)
        {
            var testResult = results[i];
            name = testList[i].name;
            var resultString = "";
            var element = document.getElementById(name + "results");
            if (element && name)
            {
                if (testResult)
                {
                    resultString += name + ": " + formatTime(testResult.mean) + " " + formatError(testResult.error) + " ";
                    resultString += "<a id=\"" + name + "resultsdetailsexpand\" class=\"testexpand\"><\/a>";
                    resultString += "<div id=\"" + name + "resultsdetails\" class=\"testdetails\">";

                    var run = testResult.run;
                    jLen = run.length;
                    for (j = 0; j < jLen; j += 1)
                    {
                        resultString += j + ": " + formatTime(run[j]) + "<br>";
                    }

                    resultString += "<\/div>";
                }
                else
                {
                    resultString += name + ": Incomplete";
                }
            }
        }

        var sortResults = function sortResultsFn(a, b) {
            var aRes = a.result;
            var bRes = b.result;
            return aRes - bRes;
        };

        ilen = compareList.length;
        for (i = 0; i < ilen; i += 1)
        {
            var compareString = "Comparison " + (i + 1) + ": (Lowest to highest)<br>";
            var compareNames = compareList[i];
            var compareResults = [];
            jLen = compareNames.length;
            for (j = 0; j < jLen; j += 1)
            {
                name = compareNames[j];
                var result = findResult(name);
                //TODO: Use index instead of name
                if (result)
                {
                    compareResults[compareResults.length] = { name: name, result: result };
                }
            }

            if (compareResults.length > 1)
            {
                compareResults.sort(sortResults);
                jLen = compareResults.length;
                for (j = 0; j < jLen; j += 1)
                {
                    if (j !== 0)
                    {
                        compareString += " | ";
                    }
                    compareString += compareResults[j].name + ": (" + formatTime(compareResults[j].result) + ")";
                }
                compareString += "<br>";

                comparisonText += compareString;
            }
        }

        var elapsedTime = (TurbulenzEngine.time - totalExecutionTime).toFixed(2);

        initResults();

        //TODO: Improve method of accessing 2DP
        document.getElementById("benchmarkCompare").innerHTML = comparisonText;
        document.getElementById("results").innerHTML = "Elapsed Time: " + elapsedTime + " seconds<br>" +
            (((BF.getTestCount() === runTestCount) && !stop && BF.hasFinishedAllEstimates() && !quickTest) ? ("<h2>Turbulenz Performance Score: " + calcScore() + "<\/h2>") : "");

        inProgress = false;
    };

    var calcErrorColor = function calcErrorColorFn(error)
    {
        var floor = Math.floor;
        var red = 100;
        var green = 100;
        var blue = 100;

        if (error > 5.0)
        {
            red = 255;
            green += floor(((100.0 - error) / 95.0) * 155);
        }
        else
        {
            green = 255;
            red += floor((error / 5.0) * 155);
        }
        return "rgb(" + red + "," + green + "," + blue + ")";
    };

    var postResult = function postResultFn(name, testIndex)
    {
        var testResult = results[testIndex];
        var resultString = 'Finished!';
        var resultProgress;
        if (testResult)
        {
            processResult(testResult);
            var error = testResult.error;
            var progress = window.$("#" + name + "results .resultprogress");

            if (stop)
            {
                resultString = 'Aborted';
                resultProgress = '';
            }
            else
            {
                resultProgress = formatTime(testResult.mean) + " " + formatError(error);
            }

            progress.html(resultProgress);
            progress.css("color", calcErrorColor(error));
            window.$("#" + name + "results .resultstatus").html(resultString);
        }
    };

    var updateProgress = function updateProgressFn(testIndex, testsComplete, testTotal, lastRun, total)
    {
        var overallProgress = 500 * (lastRun / total);
        var testProgress = 200 * (testsComplete / testTotal);
        var test = BF.tests[testIndex];
        var name = test.name;

        if (testsComplete === testTotal)
        {
            postResult(name, testIndex);
        }
        else
        {
            window.$("#" + name + "results .resultprogress").html('<img src="' + progressbarTestSrc + '" class="progressbar" width="200px" height="20px" style="background-position: -' + (1024 - testProgress) + 'px 0px;"><\/img>');
            window.$("#" + name + "results .resultstatus").html('Running');
        }

        window.$("#benchmarkcount").html("Benchmark: " + name + ": " + (lastRun + 1) + "/" + total);
        window.$("#overallprogressbarimg").css('backgroundPosition', '-' + (1024 - overallProgress) + 'px 0px');
    };

    var selectAllTests = function selectAllTestsFn()
    {
        var testList = BF.tests;
        var iLen = testList.length;
        for (var i = 0; i < iLen; i += 1)
        {
            var elem = <HTMLInputElement>(document.getElementById(group + "_" + i));
            if (elem)
            {
                elem.checked = true;
            }
        }
    };

    var selectNoTests = function selectNoTestsFn()
    {
        var testList = BF.tests;
        var iLen = testList.length;
        for (var i = 0; i < iLen; i += 1)
        {
            var elem = <HTMLInputElement>(document.getElementById(group + "_" + i));
            if (elem)
            {
                elem.checked = false;
            }
        }
    };

    var selectDefaultTests = function selectDefaultTestsFn()
    {
        // Default tests is all tests
        var testList = BF.tests;
        var iLen = testList.length;
        for (var i = 0; i < iLen; i += 1)
        {
            var elem = <HTMLInputElement>(document.getElementById(group + "_" + i));
            if (elem)
            {
                elem.checked = true;
            }
        }
    };

    var runTests = function runTestsFn()
    {
        var testIndex, test, testResults, findNext;
        var currentTest;
        var currentTestProgress;

        if (!pause)
        {
            if (!runList)
            {
                // Nothing to run
                finish();
                return;
            }

            currentTest = {};
            currentTest.next = runList;

            // Reset the previous results
            results = [];
            stop = false;

            totalExecutionTime = TurbulenzEngine.time;
            currentTestProgress = 0;
        }
        else
        {
            currentTest = {};
            currentTest.next = lastTest;
            currentTestProgress = lastTestProgress;
            pause = false;
        }

        var runNextTest = function runNextTestFn()
        {
            var runResults = testResults.run;
            var runResultsLength = runResults.length;
            var currentTime;
            var deltaTime;

            function finishTest()
            {
                deltaTime = TurbulenzEngine.time - currentTime;

                test.destroy();

                runResults[runResultsLength] = deltaTime;
                currentTestProgress += 1;

                updateProgress(currentTest.testIndex, runResults.length, currentTest.numOfIterations, currentTestProgress, runCount);

                yieldTest(findNext);
            }

            function waitForTest()
            {
                if (test.isWaiting())
                {
                    yieldTest(waitForTest);
                }
                else
                {
                    finishTest();
                }
            }

            test.init();

            // Attempt to force garbage collection before running test
            TurbulenzEngine.flush();

            currentTime = TurbulenzEngine.time;

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

        findNext = function findNextFn()
        {
            currentTest = currentTest.next;
            if (!currentTest || stop)
            {
                if (currentTest)
                {
                    testIndex = currentTest.testIndex;
                    test = BF.tests[testIndex];
                    postResult(test.name, testIndex);
                }
                // Finished tests
                processResults();
                postResults();
                finish();
                return;
            }

            if (pause)
            {
                lastTest = currentTest;
                lastTestProgress = currentTestProgress;

                test = BF.tests[lastTest.testIndex];

                window.$("#" + test.name + "results .resultstatus").html('Paused');

                finish();
                return;
            }

            testIndex = currentTest.testIndex;
            test = BF.tests[testIndex];
            testResults = results[testIndex];

            if (testResults === undefined)
            {
                results[testIndex] = {
                    run: []
                };

                testResults = results[testIndex];
            }

            runNextTest();
        };

        findNext();
    };

    startTests = function startTestsFn()
    {
        if (!inProgress)
        {
            inProgress = true;
            setState(quickTest ? state.testing : state.benchmarking);

            generateTests();
            runTests();
        }
        else
        {
            if (!pause && (currentState === state.benchmarking))
            {
                setState(state.paused);
                pause = true;
            } else if (pause && (currentState === state.paused))
            {
                setState(quickTest ? state.testing : state.benchmarking);
                runTests();
            }
        }
    };

    updateTestCount = function updateTestCountFn()
    {
        var testList = BF.tests;
        var iLen = testList.length;
        for (var i = 0; i < iLen; i += 1)
        {
            var test = testList[i];
            var name = test.name;
            var targetIterations = test.estimatedRuns;
            window.$('#' + name + 'iter').val
            (<string><any>(
                (targetIterations && !quickTest) ? targetIterations : defaultIterations));
        }
    };

    loadTests = function loadTestsFn()
    {
        var toggleDescription = function toggleDescriptionFn() {
            var descNode = document.getElementById(this.getAttribute("detailsID"));
            if (descNode)
            {
                var display = descNode.style.display;
                if (display === "block")
                {
                    descNode.style.display = "none";
                    this.innerHTML = "[+]";
                }
                else
                {
                    descNode.style.display = "block";
                    this.innerHTML = "[-]";
                }
            }
        };

        var initDescriptions = function initDescriptionsFn()
        {
            var i;
            var divs = document.getElementsByTagName("div");
            var iLen = divs.length;

            for (i = 0; i < iLen; i += 1)
            {
                var test = <HTMLDivElement>(divs[i]);
                if (test.className === "testselect")
                {
                    var j, jLen;
                    var childNodes = test.childNodes;
                    var button = null;
                    var desc = null;

                    jLen = childNodes.length;
                    for (j = 0; j < jLen; j += 1)
                    {
                        var child = <HTMLElement>(childNodes[j]);
                        if (child.className === "testdetails")
                        {
                            desc = child;
                        }
                    }

                    if (desc)
                    {
                        button = document.getElementById(desc.id + "expand");
                        if (button)
                        {
                            button.innerHTML = "[+]";
                            button.setAttribute("detailsID", desc.id);
                            button.onclick = toggleDescription;
                            button.style.cursor = 'pointer';
                            desc.style.display = "none";
                        }
                    }
                }
            }
        };

        // populate the test list
        var selectionString = '<h3>' + group + '<\/h3>';
        var testList = BF.tests;
        var iLen = testList.length;
        for (var i = 0; i < iLen; i += 1)
        {
            var test = testList[i];
            var desc = test.description;
            var jLen = desc.length;
            var name = test.name;
            var targetIterations = test.estimatedRuns;

            selectionString += '<div class="testselect"><h4><input type="checkbox" id="' +
                group + '_' + i + '" checked="checked" />' +
                name + '<a id="' + name + 'detailsexpand" class="testexpand"><\/a><\/h4>' +
                '<div id="' + name + 'details" class="testdetails">' +
                'Estimated Iterations:<br><input type="text" id="' + name + 'iter" value="' + ((targetIterations && !quickTest) ? targetIterations : defaultIterations) + '" size="5" disabled="true"/><br>' +
                'Description:<div id="' + name + 'desc" class="testdescription">';

            for (var j = 0; j < jLen; j += 1)
            {
                selectionString += desc[j] + '<br>';
            }

            selectionString += '<\/div><a href="' + test.path + '" class="testsource">Source<\/a><\/div><\/div>';
        }
        document.getElementById("benchmarkselection").innerHTML = selectionString;

        initDescriptions();
    };

    interrupt = function interruptFn()
    {
        stop = true;
        if (pause)
        {
            if (lastTest)
            {
                var testIndex = lastTest.testIndex;
                var test = BF.tests[testIndex];
                postResult(test.name, testIndex);
            }
            processResults();
            postResults();
            finish();
            inProgress = false;
            pause = false;
        }
    };

    runQuickTests = function runQuickTestsFn()
    {
        quickTest = true;
        updateTestCount();
        startTests();
    };

    setState = function setStateFn(nextState)
    {
        var b1 = <HTMLInputElement>(document.getElementById("button01"));
        var b2 = <HTMLInputElement>(document.getElementById("button02"));
        var b3 = <HTMLInputElement>(document.getElementById("button03"));
        var b4 = <HTMLInputElement>(document.getElementById("button04"));
        var b5 = <HTMLInputElement>(document.getElementById("button05"));
        var b6 = <HTMLInputElement>(document.getElementById("button06"));

        switch (nextState)
        {
        case state.uninit:
            b1.value = "Initialize";
            b1.onclick = runEstimateTests;
            b1.disabled = false;

            b2.value = "Select None";
            b2.onclick = selectNoTests;
            b2.disabled = false;

            b3.value = "Select All";
            b3.onclick = selectAllTests;
            b3.disabled = false;

            b4.value = "Defaults";
            b4.onclick = selectDefaultTests;
            b4.disabled = false;

            b5.value = "Stop";
            b5.onclick = interrupt;
            b5.disabled = true;

            b6.value = "Quick Test";
            b6.onclick = runQuickTests;
            b6.disabled = false;

            currentState = nextState;
            break;

        // Following state assumes that functions are set once by uninit
        case state.init:
            b1.value = "Run";
            b1.onclick = startTests;
            b1.disabled = false;

            // Stop
            b5.disabled = true;

            b6.value = "Quick Test";
            b6.disabled = false;

            currentState = nextState;
            break;

        case state.initializing:
            b1.value = "Initializing";
            b1.disabled = true;

            // Stop
            b5.disabled = false;

            // Quick Test
            b6.disabled = true;

            currentState = nextState;
            break;

        case state.testing:
            // Init/Run
            b1.disabled = true;

            // Stop
            b5.disabled = false;

            b6.value = "Testing";
            b6.disabled = true;

            currentState = nextState;
            break;

        case state.benchmarking:
            b1.value = "Pause";
            b1.disabled = false;

            // Stop
            b5.disabled = false;

            // Quick Test
            b6.disabled = true;

            currentState = nextState;
            break;

        case state.paused:
            b1.value = "Resume";
            b1.disabled = false;

            currentState = nextState;
            break;
        }
    };

    // Setup html
    window.$("#overallprogressbar").html('<img id="overallprogressbarimg" src="' + progressbarOverallSrc + '" class="progressbar" width="500px" height="20px" style="background-position: -1024px 0px;"/>');
    window.$("#benchmarkcount").html('Benchmarks');

    if (!estimate)
    {
        finish();
    }
    else
    {
        runEstimateTests();
    }

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        results = [];

        runList = null;
        lastTest = null;
        startTests = null;
        loadTests = null;

        TurbulenzEngine.flush();
        BF = null;
        params = null;
    };
};
