const saveMessage = require('../clients/saveMessage');

module.exports = (message) => saveMessage({
  ...message,
  qId : message.qId,
  status : 'PENDING'
},
() => {
  console.log("Error saving PENDING message");
}
)