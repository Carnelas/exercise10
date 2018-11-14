const mongoose = require("mongoose");
const database = require("../database");

let messageSchema = new mongoose.Schema({
  destination: String,
  body: String,
  location: {
  	name: {
      type: String,
      default: "Default"
    },
    cost: {
      type: Number,
      default: 1
    }
  },
  status: {
    type: String,
    enum: ["PENDING", "ERROR", "OK", "TIMEOUT", "INSUFICIENT CREDIT"]
  },
  qId: {
    type : String,
    default: "Default"
  }, 
  payment: Boolean
});

module.exports = (dbKey) => database.get(dbKey).model("Message", messageSchema);
