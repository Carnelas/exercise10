const database = require("../database");
const Message = require("../models/message");
const { cleanClone } = require("../utils");

function saveMessageReplica(replica, retries) {
  if (retries > 0) {
    replica.markModified("body");
    return replica
      .save()
      .then(doc => {
        console.log("Message replicated successfully", replica);
        return doc;
      })
      .catch(err => {
        console.log("Error while saving message replica", err);
        console.log("Retrying...");
        return saveMessageReplica(replica, retries - 1);
      });
  }
}

function saveMessageTransaction(newValue, params) {
  const MessagePrimary = Message();
  const MessageReplica = Message("replica");

  let message = new MessagePrimary(newValue);
   
  return MessagePrimary
    .findOneAndUpdate({
      "qId": params
    }, newValue)
    .then(doc => {
      if (doc == null){
        return message.save().then(doc => {
          console.log("Message saved successfully:", doc);
           return cleanClone(doc);
        })
      }else {
        console.log("Message status updated successfully:", newValue)
        return cleanClone(doc);
      }     
    })
    .then(clone => {
      let replica = new MessageReplica(newValue);
      saveMessageReplica(replica, 3);
      return newValue;
    })
    .catch(err => {
      console.log("Error while saving message", err);
      throw err;
    });
}

module.exports = function(messageParams, cb, params) {
  saveMessageTransaction(messageParams, params)
    .then(() => cb())
    .catch(err => {
      cb(undefined, err);
    });
};
