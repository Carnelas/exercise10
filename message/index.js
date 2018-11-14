const http = require("http");
const express = require("express");
require("./src/controllers/addToQueue");
const addToQueue = require("./src/controllers/addToQueue");

const bodyParser = require("body-parser");
const {
  Validator,
  ValidationError
} = require("express-json-validator-middleware");

const getMessages = require("./src/controllers/getMessages");
const getOneMessage = require("./src/controllers/getOneMessage");
const getStatus = require("./src/clients/getStatus");
const getVersion = require("./src/clients/getVersion");
const app = express();

const validator = new Validator({ allErrors: true });
const { validate } = validator;

const messageSchema = {
  type: "object",
  required: ["destination", "body"],
  properties: {
    destination: {
      type: "string"
    },
    body: {
      type: "string"
    },
    location: {
      name: {
        type: "string"
      },
      cost: {
        type: "number"
      }
    }
  }
};

app.post(
  "/messages",
  bodyParser.json(),
  validate({ body: messageSchema }),
  addToQueue
);

app.get("/health", getStatus);

app.get("/messages", getMessages);

app.get("/messages/:id/status", getOneMessage);

/* app.get("/version", getVersion);
 */
app.use(function(err, req, res, next) {
  console.log(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

app.listen(9007, function() {
  console.log("App started on PORT 9007");
});
