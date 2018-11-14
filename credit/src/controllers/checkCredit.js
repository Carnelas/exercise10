const getCredit = require("../clients/getCredit");
const decreaseCredit = require('./decreaseCredit')

module.exports = function checkCredit(job, done) {
  return getCredit().then(result => {
    current_credit = result[0].amount;
    if (current_credit > 0) {
      decreaseCredit()
      return true
    } else {
      return false
    }
  });
}