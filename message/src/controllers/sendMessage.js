const http = require("http");
const saveMessage = require("../clients/saveMessage");
const rollBackQueue = require("./rollBackQueue")

const random = n => Math.floor(Math.random() * Math.floor(n));

module.exports = function (message, done) {
  console.log(message)
  const body = JSON.stringify(message);
  const idQuery = message.qId
if (message.payment === true){


  const postOptions = {
    host: "messageapp",
    port: 3000,
    path: "/message",
    method: "post",
    json: true,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  };

  let postReq = http.request(postOptions);

  postReq.on("response", postRes => {
    if (postRes.statusCode === 200) {
      saveMessage({
          ...message,
          qId: message.qId,
          status: "OK"
        },
        () => {
          console.log("Error in server response");
        }, idQuery
      );
    } else {
      console.error("Error while sending message");

      saveMessage({
          ...message,
          qId: message.qId,
          status: "ERROR",
          payment: false
        },
        () => {
          rollBackQueue()
          console.log("Internal server error: SERVICE ERROR");
        }, idQuery
      );
    }
  });

  postReq.setTimeout(random(6000));

  postReq.on("timeout", () => {
    console.error("Timeout Exceeded!");
    postReq.abort();

    saveMessage({
        ...message,
        qId: message.qId,
        status: "TIMEOUT"
      },
      () => {

        console.log("Internal server error: TIMEOUT");
      }, idQuery
    );
  });
  postReq.on("error", () => {});

  postReq.write(body);
  postReq.end();
} else {
  saveMessage({
    ...message,
    qId: message.qId,
    status: "INSUFICIENT CREDIT"
  },
  () => {

    console.log("Internal server error:INSUFICIENT CREDIT");
  }, idQuery
);
}
}