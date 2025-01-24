

const socket  = io.connect('http://localhost:3000');


let main = document.querySelector('main');
let nameInput = document.getElementById('userName');
let loginPage = document.getElementById('loginPage');
let btnChat = document.getElementById('btnChat');
let messages = document.getElementById('messages');
let send = document.getElementById('send');
let text = document.getElementById('text');
let onlineCont = document.getElementById('online-cont');

let userName;

// Starting chat
btnChat.addEventListener('click',()=>{
    userName = nameInput.value;
    loginPage.style.display = 'none';
    main.style.display = 'flex';


    div = document.createElement('div');
    div.innerHTML = `Welcome ${userName}!`;
    div.classList.add('notification');
    messages.appendChild(div);

    //Adding the user in the list of connected users
    
    socket.emit('join',userName);
});

// Getting old messages
socket.on('load-msg',(prevMsg)=>{
    console.log(prevMsg)
    prevMsg.forEach(element=>{ 
        createIncomingMessage(element);
    });
})

socket.on('get-active-user',userList=>{
    onlineCont.innerHTML='';
    console.log('working - 45')
    userList.forEach(element=>{
        
        createActiveUser(element);
    })
})


socket.on('newUser',(userName)=>{
    //notification on joiner
    newJoinerNotification(userName);
});



//Sending new message
send.addEventListener('click',()=>{
    let audio = new Audio('./Src/mixkit-message-pop-alert-2354.mp3');
    audio.play();
    let content = text.value;
    createOutgoingMessage(content);
    socket.emit('send-message',content);
    text.value="";
});


//Receiving new message
socket.on('rcv-message',(newMessage)=>{
    let audio = new Audio('./Src/incoming tone.mp3');
    audio.play();
    createIncomingMessage(newMessage);
    
});



socket.on('user-left',(user)=>{
    div = document.createElement('div');
    div.innerHTML = `${user} has left the chat`;
    div.classList.add('notification');
    messages.appendChild(div);

    removeDivByName(user);
    
})


function createActiveUser(element){
    list = document.createElement('div');
    list.classList.add('list')
    list.innerHTML = `<h3>${element.user}</h3><span class="logged-in">●</span>`;
    onlineCont.appendChild(list);
}




function newJoinerNotification(userName){
    div = document.createElement('div');
    div.innerHTML = `${userName} has joined the chat`;
    div.classList.add('notification');
    messages.appendChild(div);
}




function removeDivByName(name) {
    const container = document.getElementById("online-cont");

    const lists = container.querySelectorAll(".list");
    lists.forEach(list => {

        const personName = list.querySelector("h3").textContent.trim();
        if (personName === name) {
            list.remove();
            console.log(`Removed the div for ${name}`);
        }
    });
}

function createOutgoingMessage(content){
    let div = document.createElement('div');
    div.classList.add('outgoing','msg-item');
    div.innerHTML = `
        <div class=' message out'>
                            <div class="name-time"><h6>You </h6><h6>${new Date().toLocaleTimeString()}</h6></div>
                            <p>${content}</p>
                        </div>
                        <div class="avatar"></div>
    `
    messages.appendChild(div);
}

function createIncomingMessage(newMessage){
    div = document.createElement('div');
    div.classList.add('incoming','msg-item');
    div.innerHTML = `
        <div class="avatar"></div>
                        <div class=' message in'>
                            <div class="name-time"><h6>${newMessage.user}</h6> <h6>${new Date(newMessage.timeStamp).toLocaleTimeString()}</h6></div>
                            <p>${newMessage.message}</p>
                        </div>
    `
    messages.appendChild(div);
}