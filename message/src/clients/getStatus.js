var os = require("os");
var hostname = os.hostname();

module.exports = function(req, res) {
  res.status(200);
  res.json(hostname);
};
