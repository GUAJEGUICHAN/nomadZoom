//서버

import express from "express";
import http from "http";
import {Server}  from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);

const wsServer = new Server(httpServer);

wsServer.on("connection",(socket)=>{
    socket["nickname"]= "anon";
    socket.onAny((event)=>{
        console.log(`socket.onAny에서 전달한 event값 :${event}`)
    })

    socket.on("enterRoom",(roomName,newName,done)=>{//foreach를 써보자
        socket.join(roomName)
        socket["nickname"]= newName;
        socket.to(roomName).emit("welcome",`${socket["nickname"]}님이 입장했습니다.`)//왜 welcome이 안뜨지
        done();
        // done으로 해당 클라이언트 웹페이지 변경
    })

    socket.on("newMessage",(msg,room,done)=>{//foreach를 써보자
        socket.to(room).emit("newMessage",`${socket["nickname"]} : ${msg}`)//room에 있는 자신을 제외한 소켓들에게 emit한다. 
        //done으로 자신이 보낸 메세지 띄우기
        done();
    })

    // socket.on("disconnecting",()=>{
    //     socket.rooms.forEach((room)=>{
    //         socket.to(room).emit("bye",socket.nickname)
    //     })
    // })

    //닉네임 변경
    // socket.on("nickname",(nickname,room,done)=>{
    //     socket.to(room).emit("newMessage",`${socket["nickname"]}님이 ${nickname}(으)로 닉네임을 변경하였습니다.`)
    //     socket["nickname"]=nickname
    //     done();
    // })
})

const handleListen = () => console.log(`Listening on http://localhost:3000`);

httpServer.listen(3000, handleListen);