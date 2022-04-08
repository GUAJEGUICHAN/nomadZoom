//프론트

// const main = document.querySelector("main")
const welcome = document.getElementById("welcome")
const room = document.getElementById("room");
const enterRoom = welcome.querySelector("form")
const header = document.querySelector("header")
const nickname = document.getElementById("nickname")
const message = document.getElementById("message")
const chatBox = document.getElementById("chatbox")
const chat = document.getElementById("chat")
const roomList = document.getElementById("roomList")
const title = header.querySelector("h1")

// document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
// chatBox.scrollTop = chatBox.scrollHeight;
// chatBox.scrollTo(0,chatBox.scrollHeight)
// console.log(chatBox.scrollHeight)

// window.scrollTo(0,document.body.scrollHeight);

room.hidden = true
chatBox.hidden = false

//socket.io는 외부 링크에서 가져와야한다.
const socket = io();

let roomName;
let theNumberOfParticipants =0;

//div 바꾸기, 타이틀 넣기
function showRoom(){
  welcome.hidden=true;
  room.hidden =false;

  // title.innerText = roomName + " 채팅방";

  // newNickname = prompt("닉네임을 입력해주세요")
  // socket.emit("nickname",roomName,showAlelrt);
}

function showAlelrt(){
  // nickname.hidden = true;
  console.log(`이름이 변경되었습니다.`)
}

function updateChat(){
  const li = document.createElement("li");
  const input = message.querySelector("input")
  const messageContent = input.value;
  li.innerText = "You : " + messageContent;
  chat.appendChild(li);
  input.value=""
}
//input값 socket에 보내기
enterRoom.addEventListener("submit",(event)=>{
  event.preventDefault();
  const input = welcome.querySelector("input")
  roomName=input.value;
  socket.emit("enterRoom",roomName,prompt("닉네임을 입력해주세요"),showRoom);
  input.value="";
})
 
//닉정하고 닉입력칸 사라지고 채팅장 뜨기
// nickname.addEventListener("submit", (event)=>{
//   event.preventDefault();
  // const input = nickname.querySelector("input")
  // const nName = input.value
  // socket.emit("nickname",nName,roomName,showAlelrt);
  // input.value=""
  // chatBox.hidden = false

// })

message.addEventListener("submit", (event)=>{
  event.preventDefault();
  const input = message.querySelector("input")
  const messageContent = input.value;
  socket.emit("newMessage",messageContent,roomName,updateChat)
  chatBox.scrollTop = chatBox.scrollHeight;
})

socket.on("welcome",(nName,countRoom)=>{
  console.log("프론트 welcome", nName,countRoom)
  const li = document.createElement("li");
  li.innerText = "[안내] : "+nName+"님이 입장했습니다."
  chat.appendChild(li);

  theNumberOfParticipants = countRoom
  console.log("title.innerText : "+title.innerText)
  console.log('바꾸고 싶은 Title.innerText : '+roomName + ` 채팅방\n(${countRoom})명`)
  title.innerText = roomName + ` 채팅방\n(${theNumberOfParticipants})명`
  // title.textContent = 'adsfjkhasdfkjlashdflk'
})

socket.on("newMessage",(msg)=>{
  const li = document.createElement("li");
  li.innerText = msg
  chat.appendChild(li);
  chatBox.scrollTop = chatBox.scrollHeight;
})

socket.on("room_change",(rooms)=>{
  // console.log(rooms)
  roomList.innerHTML = ""
  rooms.forEach(aRoom=>{
    const li = document.createElement('li')
    li.innerText = aRoom
    roomList.appendChild(li)
  })
})

socket.on("bye",(nName)=>{
  const li = document.createElement("li");
  li.innerText = "[안내] : "+nName+"님이 채팅방을 나갔습니다."
  chat.appendChild(li);
  chatBox.scrollTop = chatBox.scrollHeight;
  theNumberOfParticipants--;
  title.innerText = roomName + ` 채팅방\n(${theNumberOfParticipants})명`

})
