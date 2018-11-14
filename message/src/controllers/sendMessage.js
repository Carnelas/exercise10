const http = require("http");
const saveMessage = require("../clients/saveMessage");
const rollBackQueue = require("./rollBackQueue");
const braker = require("../braker");
const util = require("util");

braker.on("snapshot", snapshot => {
  console.log(`Circuit open --> ${util.inspect(snapshot.open)}`);
});
braker.on("failure", () => console.log("FAIL"));
braker.on("sucess", () => console.log("SUCESS"));

module.exports = function(message, done) {
  console.log(message);
  const body = JSON.stringify(message);
  const idQuery = message.qId;

  if (message.payment === true){

  const postOptions = {
    host: "localhost",
    port: 3000,
   /*  host: "messageapp",
    port: 3000, */
    path: "/message",
    method: "post",
    json: true,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  };
  function asyncFunction(postOptions) {
    return new Promise(function(resolve, reject) {
      let postReq = http.request(postOptions, function(response) {
        if (postRes.statusCode === 200) {
          saveMessage(
            {
              ...message,
              qId: message.qId,
              status: "OK"
            },
            function(_result, error) {
              if (error) {
                console.log("Error 500", error);
              } else {
                console.log("Successfull");
              }
              idQuery;
            }
          );
          resolve(message);
        } else if (response.statusCode >= 500) {
          console.error("Error while sending message");
        } else {
          saveMessage(
            {
              ...message,
              qId: message.qId,
              status: "ERROR",
              payment: false
            },
            () => {
              rollBackQueue();
              console.log("Internal server error: SERVICE ERROR");
            },
            idQuery
          );
        }
      });

      postReq.setTimeout(1000);
      postReq.on("timeout", () => {
        console.error("Timeout Exceeded!");
        postReq.abort();
        saveMessage(
          {
            ...message,
            qId: message.qId,
            status: "TIMEOUT"
          },
          () => {
            console.log("Internal server error: TIMEOUT");
          },
          idQuery
        );
        reject(new Error("Timeout error"));
      });
      postReq.write(body);
      postReq.end();
    });
  }
  const circuit = braker.slaveCircuit(asyncFunction);
  circuit
    .exec(postOptions)
    .then(result => {
      console.log(`result: ${result}`);
    })
    .catch(err => {
      console.error(`${err}`);
    })
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
};
