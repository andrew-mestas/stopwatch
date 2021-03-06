
var StopWatch = function(){
  this.times = [],
  this.completed = 0,
  this.start = 0,
  this.end = 0
  this.tickError = 0;
  this.performanceError = 0;
};

StopWatch.prototype.clear = function(){
  this.times = [];
  this.completed = 0,
  this.start = 0,
  this.end = 0
}

StopWatch.prototype.ExecuteAsync = function(fn, arg){
  return new Promise((res, rej)=>{
    this.start = performance.now();
    fn.apply(this, arguments[1]).then((result)=>{
      this.end = performance.now(); 
      var time = this.end - this.start;
      this.times.push(time);
      res({result: result, SW: this});
    })
  })
}

StopWatch.prototype.Execute = function(fn, arg){
  return new Promise((res, rej)=>{
    arguments[1].push(()=>{
      this.end = performance.now(); 
      var time = this.end - this.start;
      this.times.push(time);
      res(this);
    })

    this.start = performance.now();
    fn.apply(this, arguments[1])
  })
}

StopWatch.prototype.getMeanTime = function(){
  return this.Stats(this.times).Mean
}

StopWatch.prototype.Start = function(){
  this.start = performance.now();
}

StopWatch.prototype.Stop = function() {
  this.end = performance.now();
  var time = this.end - this.start;
  this.times.push(time)
}

StopWatch.prototype.Tick = function(){
  this.times.push(performance.now()- this.start);
  this.start = performance.now();
}

StopWatch.prototype.squareDiff = function(mean, value){
      return (value - mean) * (value - mean)
}

StopWatch.prototype.Stats = function(values){
  var vals;
  if(values) { vals = values; }
  else { vals = this.times };
  var mean = vals.reduce((a,b)=>{return a+b}) / vals.length;
  var sd = vals.reduce((a,b)=>{return a + this.squareDiff(mean, b)},0);
  var sum = vals.reduce((a,b) => { return a + b; }, 0);
  return {Mean: mean, SD: Math.sqrt(sd / vals.length), Sum: sum};
}
