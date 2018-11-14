const Credit = require("../models/credit");

module.exports = function(conditions = { location: "Default" }) {
  return Credit().find(conditions);
};
