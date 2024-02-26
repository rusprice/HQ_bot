const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function joinGame(myid) {
  return function() {

  const userId = myid || getRandomIntInclusive(1, 100000);
  console.log("userId", userId);
  const ws = new WebSocket("wss://staging.question.house/ws", {
    headers: { "authorization": userId },
  });

  ws.userId = userId;

  ws.on("error", function (e) {
    console.log("socket error", e);
    setTimeout(joinGame(ws.userId), 1000);
  });

  ws.on("close", function (ree) {
    console.log("socket close", ree);
    setTimeout(joinGame(ws.userId), 1000);
  });

  ws.on("open", function open() {
    ws.send(
      JSON.stringify({
        type: "subscribe",
      })
    );
    console.log("Connected");
  });

  ws.on("message", function message(data) {
    try {
      var message = JSON.parse(data);
    } catch (e) {
      console.log(data);
    }

    if (message.type == "question") {
      ws.send(
        JSON.stringify({
          type: "answer",
          answerId: message.answers[Math.floor(Math.random() * message.answers.length)].answerId,
        })
      );
    }
    //console.log('received: %s', data);
  });
  }
}

  for (var i = 0; i < 1000; i++) {
    joinGame()();
  }

var http = require("http");

http
  .createServer(function (req, res) {
    res.write("Hello World!");
    res.end();
  })
  .listen(8080);
