// all HTML elements ids
const getBtn = document.getElementById('fetchBtn');
const inboxName = document.getElementById('nameInbox');
const inboxPassword = document.getElementById('passowrdInbox');

const sendContainer = document.getElementById('sendContainer');
const sendBtn = document.getElementById('sendBtn');
const sendTo = document.getElementById('sendTo');
const sendMessage = document.getElementById('sendMessage');

const messageContainer = document.getElementById('messages');
const messages = document.getElementById('message');

const registerContainer = document.getElementById('registerContainer');
const registerBtn = document.getElementById('registerBtn')
const registerName = document.getElementById('register_name')
const registerPassword = document.getElementById('register_password')

const err = document.getElementById('err')
const success = document.getElementById('success')

const loginerr = document.getElementById('loginerr')

const senderr = document.getElementById('senderr')

// user name youre logged in as
let loggedInName = '';

// register function
registerBtn.addEventListener('click', ()=>{
    let registerInfo = [
        registerName.value,
        registerPassword.value
    ]

    //console.log(registerInfo)

    fetch('http://localhost:3000/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerInfo)
    })
    .then(res => res.json())
    .then(data => {
        if(data == 'err'){
            success.style.display = 'none'
            err.style.display = 'block'
        } else {
            err.style.display = 'none'
            success.style.display = 'block'
            registerName.value = ''
            registerPassword.value = ''
        }
    })

})

// send function
sendBtn.addEventListener('click', ()=>{
    let sendInfo = [
        loggedInName,
        sendTo.value,
        sendMessage.value
    ]

    fetch('http://localhost:3000/send', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendInfo)
    })
    .then(res => res.json())
    .then(data => {
        if(data == 'err'){
            senderr.style.display = 'block'
        } else {
            senderr.style.display = 'none'
            sendTo.value = ''
            sendMessage.value = ''
        }
    })

})

// login function
getBtn.addEventListener('click', ()=>{  // login Btn click event!!!
    let loginInfo = [
        inboxName.value,
        inboxPassword.value
    ]

    fetch('http://localhost:3000/getinbox',{ // <-- somtimes work and some time not
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
    })
    .then(res => res.json())
    .then(data => {
        if(data == 'err'){
            loginerr.style.display = 'block'
        } else {
            loginerr.style.display = 'none'
            senderr.style.display = 'none'
            sendTo.value = ''
            sendMessage.value = ''
            loggedInName = data.name
            show(data.messages);
        }
    })

    inboxName.value = ''
    inboxPassword.value = ''
})


// functions wich hiddes and shows messages and containers
function show(messageArray){
    hiddeRegister();
    hiddeElements();
    for(let i = 0; i < messageArray.length; i += 2){
        creatMessageElements(messageArray[i], messageArray[i + 1])
    }
    openSend();
    openInbox();
}

// creats messages when loggin in
function creatMessageElements(from, mess){
    let newContainer = document.createElement('div');
    newContainer.setAttribute('id', 'message')

    let newfrom = document.createElement('span');
    newfrom.innerHTML = 'from: ' + from;
    newfrom.setAttribute('id', 'from')
    newContainer.appendChild(newfrom);

    let newMessage = document.createElement('span');
    newMessage.innerHTML = mess;
    newMessage.setAttribute('id', 'mess')
    newContainer.appendChild(newMessage);

    messageContainer.appendChild(newContainer);
}

// clears messages when changing account
function hiddeElements(){
    while (messageContainer.firstChild){
        messageContainer.removeChild(messageContainer.firstChild)
    }
}

// hiddes registration container when loggin in
function hiddeRegister(){
    registerContainer.style.animation = 'hidderegister 2s'
    registerContainer.style.height = '0px'
    registerContainer.style.margin = '0px'
    registerContainer.style.opacity = '0'

    registerBtn.style.animation = 'fadeAway 1s'
    registerBtn.style.opacity = '0'

    registerName.style.animation = 'fadeAway 1s'
    registerName.style.opacity = '0'

    registerPassword.style.animation = 'fadeAway 1s'
    registerPassword.style.opacity = '0'

    success.style.display = 'none'
    err.style.display = 'none'
}

// opens messages container when loggin in
function openInbox(){
    messageContainer.style.animation = 'openInbox 2s';
    messageContainer.style.height = '70vh'
    messageContainer.style.margin = '20px'
};

// opens send container when loggin in
function openSend(){
    sendContainer.style.display = 'flex'
    sendContainer.style.height = '75px'
    sendContainer.style.margin = '20px'
    sendContainer.style.opacity = '1'
    sendContainer.style.animation = 'openSendIn 2s'
}