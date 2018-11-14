const kue = require('kue'),
  queue = kue.createQueue(
    {
    redis: 'redis://redis:6379'
  }
  );
const sendMessage = require('./sendMessage');
const uuidv4 = require('uuid/v4');
const savePendingMessage = require('./savePendingMessage');

module.exports = function (req, res) {
  let id = uuidv4();
  let messBody = req.body
  messBody.qId = id;
  messBody.status = "PENDING";
  messBody.payment = false;
  Promise.resolve(savePendingMessage(messBody))
    .then(saveMessage => {
      let job = queue.create('test message', messBody).ttl(7000).save(function (err) {
        res.send(`Processing message with id ${id}`)
      });
    })
}
queue.process("creditChecked", function (job, done) {
  sendMessage(job.data, done)
});
