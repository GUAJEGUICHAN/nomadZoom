//서버

import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets =[]
//웹소켓이 연결될때 아래 함수 작동
wss.on("connection", (socket) => {
    console.log("Connected to Browser ✅");
    sockets.push(socket)
    socket["nickname"] = 'anon'
    //클라이언트에서 서버가 끊겼을 때 아래 작동
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));

    //클라이언트에서 message를 전송했을 때 아래 작동
    socket.on("message",(message)=> {
        const {type, payload} = JSON.parse(message)

        switch (type){
            case "nickname":
                socket["nickname"] = payload
                socket.send(JSON.stringify(
                    {
                        type:"alertClient",
                        payload:payload.toString()
                    }
                ))
                break;
            case "newMessage":
                sockets.forEach(aSocket=>{
                    aSocket.send(JSON.stringify({
                        type:"newMessageClient",
                        payload:socket["nickname"]+": "+ payload.toString()
                    }))
                })
                break;
            default:
                console.log("???")
        }
        // sockets.forEach(aSocket => {
        //     aSocket.send(message.toString()+" from Server")
        // });
    })
});

server.listen(3000, handleListen);