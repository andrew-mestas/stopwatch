# stopwatch
An event timer can be used to time blocks of code and/or time function execution.

### Testing function block
This is an example of two timers testing out the same for loop one uses the Tick function to time each interation (after large amount of iterations there is a level of inaccuracy). The second labeled timer is the recommended approach.

```javascript
  StopWatch - Start(), End(), Tick()
```

```javascript
var StopWatch = require("./stopWatch.js");
var request = require('request');

var test = function(iters, idx){
  
  var timer = new StopWatch();
  var timerTick = new StopWatch();

  var array = [];
  var array1 = [];

  timerTick.Start();
    for (var i = 0; i < iters; i++) {
      array.push(Math.pow(i,2) ^ 24);
      timerTick.Tick();
    }
  timerTick.End();


  timer.Start();
    for (var i = 0; i < iters; i++) {
      array1.push(Math.pow(i,2) ^ 24);
    }
  timer.End();

  console.log("TEST", idx, ":", timer.getMeanTime().toFixed(4) , timerTick.Stats().Sum.toFixed(4), (timer.getMeanTime() - timerTick.Stats().Sum).toFixed(4), "\n");
}

var tests = [10, 100, 1000, 10000, 100000, 1000000];

tests.forEach(test);
```

### Timers for functions
This example we are submitting a get request and testing how log to get response. After defining the function add a callback parameter to the function with the result you want returned. Then call Execute with the function and a list of the required parameters. The result will be returned in an object with the instance of the StopWatch used to call the function. 

```javascript
var standardTimer = new StopWatch();

function go(url, cb) {
  request(url, function (error, response, body) {
    if(error) console.log('error:', error); 
    if(response && response.statusCode){
      cb(response.statusCode);
    }

  });   
}

standardTimer.Execute(go, ["https://requestb.in/y01su9y0"]).then((result)=>{
  console.log("Get Request.");
  console.log("Status code: ", result.result);
  console.log("Mean time  : ", result.SW.getMeanTime().toFixed(4), "ms");
  console.log();
})

Result: {result: result.statusCode, SW: StopWatch }

```

This is the asynchronous version of execute

```javascript
var timerAsync = new StopWatch();

function goAsync(url) {
  return new Promise((res, rej) => {
    var total = 0;
    for (var i = 0; i < 100000; i++) {
      total += i;
    }
    res({total : total});
  })  
}

timerAsync.ExecuteAsync(goAsync, ["https://requestb.in/y01su9y0"]).then((result)=>{
  console.log("Async operation time.");
  console.log("Total : ", result.result.total);
  console.log("Mean time : ", result.SW.getMeanTime().toFixed(4), "ms");
  console.log();
})
```

### Functions with no arguments
Add callback with result in it and provide empty array to execute function.

```javascipt
function timeout(cb) {
  setTimeout(function () {
    cb('1');
  }, 2000);
}

timer2.Execute(timeout, []).then((result) => {
  console.log("setTimeout operation time.");
  console.log("Mean time : ", result.SW.getMeanTime().toFixed(4), "ms");
  console.log(result.result);
})

```
