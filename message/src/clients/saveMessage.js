const Message = require("../models/message");
const saveMessageTransaction = require("../transactions/saveMessage");

module.exports = function(messageParams, cb, params) {
  const MessageModel = Message();
  let message = new MessageModel(messageParams);

  if (message.status == "OK") {
    saveMessageTransaction(messageParams, cb, params);
  } else {
    saveMessageTransaction(messageParams, cb, params);
  }
};
