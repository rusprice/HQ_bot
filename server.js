const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function joinGame() {
    const ws = new WebSocket('wss://play.question.house', {
    headers: {
        "authorization": "Bearer " + jwt.sign({ userId: getRandomIntInclusive(0,100000), username: 'bot' + getRandomIntInclusive(0,100000) }, "hihihi", { algorithm: "HS256" })
    }
});

ws.on('error', console.error);

ws.on('close', function() {
    console.log('socket close');
});

ws.on('open', function open() {
ws.send(JSON.stringify({
    type: "subscribe"
  }));
  console.log("Connected");
});

ws.on('message', function message(data) {
    try {
        var message = JSON.parse(data);
    } catch (e) {
        console.log(data);
    }

    if (message.type == "question") {
        ws.send(JSON.stringify({
            type: "answer",
            answerId: message.answers[Math.floor(Math.random()*message.answers.length)].answerId
        }));
    }
  //console.log('received: %s', data);
});
}

for (var i = 0; i < 500; i++) {
    joinGame();
}