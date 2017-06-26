var StopWatch = require("./stopWatch.js");
var request = require('request');

var test = function (iters, idx) {

  var timer = new StopWatch();
  var timerTick = new StopWatch();

  var array = [];
  var array1 = [];

  timerTick.Start();
  for (var i = 0; i < iters; i++) {
    array.push(Math.pow(i, 2) ^ 24);
    timerTick.Tick();
  }
  timerTick.End();


  timer.Start();
  for (var i = 0; i < iters; i++) {
    array1.push(Math.pow(i, 2) ^ 24);
  }
  timer.End();

  console.log("TEST", idx, ":", timer.getMeanTime().toFixed(4), timerTick.Stats().Sum.toFixed(4), (timer.getMeanTime() - timerTick.Stats().Sum).toFixed(4), "\n");
}

var tests = [10, 100, 1000, 10000, 100000, 1000000];

tests.forEach(test);

var standardTimer = new StopWatch();

function go(url, cb) {
  request(url, function (error, response, body) {
    if (error) console.log('error:', error);
    if (response && response.statusCode) {
      cb(response.statusCode);
    }

  });
}

standardTimer.Execute(go, ["https://requestb.in/y01su9y0"]).then((result) => {
  console.log("Get Request.");
  console.log("Status code: ", result.result);
  console.log("Mean time  : ", result.SW.getMeanTime().toFixed(4), "ms");
  console.log();
})

var timerAsync = new StopWatch();
var timer2 = new StopWatch();

function goAsync(url) {
  return new Promise((res, rej) => {
    request(url, function (error, response, body) {
      if (error) console.log('error:', error);
      if (response && response.statusCode) {
        res({ total: response.statusCode });

      }

    })
  })
}

timerAsync.ExecuteAsync(goAsync, ["https://requestb.in/y01su9y0"]).then((result) => {
  console.log("Async operation time.");
  console.log("Total : ", result.result.total);
  console.log("Mean time : ", result.SW.getMeanTime().toFixed(4), "ms");
  console.log();
})

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



