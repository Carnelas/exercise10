const kue = require('kue'),
  queue = kue.createQueue(
    {
    redis: 'redis://redis:6379'
  }
  );


module.exports = function (message){
  let job2 = queue.create('roll back', message).ttl(7000).save(function (err) {
    console.log("Processing payment")
  });
}