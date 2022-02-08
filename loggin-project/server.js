require('dotenv').config()
const express = require('express');
const server = express();
const mongoose = require('mongoose');
server.use(express.static('public'));
server.use(express.urlencoded({extended:true}))
server.use(express.json())

mongoose.connect(process.env.database_url)

const db = mongoose.connection
db.on('open', ()=>{
    console.log('conected to database')
})

const userSchema = mongoose.Schema({
    name: String,
    message: Array,
    password: String
})

const Account = mongoose.model('userModel', userSchema, 'Email_messages')
const users = new mongoose.model('user', userSchema, 'Email_messages')

const messageSchema = mongoose.Schema({
    from: String,
    message: String,
})

const message = new mongoose.model('message', messageSchema, 'Email_messages')

server.post('/register', (req, res) => {
    let name = req.body[0]
    let password = req.body[1]
    //console.log(name, password)

    async function find(){
        let data = await Account.findOne({name: name})

        if(data){
            //console.log('res send already existsing name')
            res.send(JSON.stringify('err'))
        } else {

            let data = new Account({
                name: name,
                message: [],
                password: password
            })

            data.save((err)=>{
                if(err){
                    console.log(err)
                }
                //console.log('new account made')
            })
            
            res.send(JSON.stringify('success'))

        }

    }
    find()

})

server.post('/send', (req, res) => {
    let from = req.body[0] 
    let to_name = req.body[1]
    let input_message = req.body[2]

    async function findAll(){
        let data = await users.findOne({name: to_name});

        if(data){
            let messageArray = data.message
            messageArray.push(from, input_message)

            let dataupdate = await users.updateOne({name: data.name}, {message: messageArray})

            res.send(JSON.stringify('success'))
        } else {
            res.send(JSON.stringify('err'))
        }
    }
    findAll();
})

server.post('/getinbox', (req, res)=>{
    let name = req.body[0]
    let password = req.body[1]

    async function getMessages(){
        let data = await users.findOne({name: name, password: password})

        if(data){
            res.send({
                messages: data.message,
                name: data.name
            });
        } else {
            res.send(JSON.stringify('err'))
        }
    }
    getMessages();
});

server.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public' + '/index.html')
})

server.listen(process.env.port)