const getOneMessage = require("../clients/getOneMessage");

module.exports = function(req, res) {
  getOneMessage({"qId": req.params.id}).then(message => {
    res.json(message.status);
  });
};
