//프론트

const messageList = document.getElementById("chatRoom")
const nicknameForm = document.getElementById("nickname")
const messageForm = document.getElementById("message")

//아래처럼 주소를 설정해야 모바일에서도 웹소켓 서버 주소를 입력할 수 있다. 
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  // console.log(message)
  const {type, payload} = JSON.parse(message.data)

  switch (type){
    case "alertClient":
      alert(payload+"로 닉네임이 변경되었습니다")
      break;
    case "newMessageClient":
      const li = document.createElement("li")
      li.innerText = payload
      messageList.appendChild(li)
      break;
  }

  // const li = document.createElement('li')
  // li.innerText(message)
  // console.log( message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input")
    const data ={
      type:"newMessage",
      payload:input.value
    }
    socket.send(JSON.stringify(data))
    input.value=""
}

function handleNickNameSubmit(event){
  event.preventDefault();
  const input = nicknameForm.querySelector("input")
  const data ={
    type:"nickname",
    payload:input.value
  }
  socket.send(JSON.stringify(data))
}

messageForm.addEventListener("submit",handleSubmit)
nicknameForm.addEventListener("submit",handleNickNameSubmit)