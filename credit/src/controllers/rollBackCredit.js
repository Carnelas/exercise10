const updateCreditTransaction = require('../transactions/updateCredit')

module.exports = function increaseCredit() {

  return updateCreditTransaction(
    {
      amount: { $gte: 1 }
    },
    {
      $inc: { amount: +1}
    },
  );
}