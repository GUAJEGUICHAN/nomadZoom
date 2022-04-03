//서버

import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//웹소켓이 연결될때 아래 함수 작동
wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  
  //클라이언트에서 서버가 끊겼을 때 아래 작동
  socket.on("close", () => console.log("Disconnected from the Browser ❌"));
  
  //클라이언트에서 message를 전송했을 때 아래 작동
  socket.on("message", (message) => {
    console.log(message.toString());
  });
  
  //서버에서 클라이언트에게 보낸다. 1회성이다.
  socket.send("hello1");
  socket.send("hello2");
  socket.send("hello3");
});

server.listen(3000, handleListen);