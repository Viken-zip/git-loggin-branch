require('dotenv').config();
const express = require('express');
const server = express();
const mongoose = require('mongoose');
server.use(express.static('public'));
server.use(express.urlencoded({extended:true}));
const port = 3000;

// dotenv database link
mongoose.connect(process.env.database);
 
const db = mongoose.connection;
db.on('open', ()=>{
    console.log('database connected');
});

// Schema for accounts
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema)

server.post('/loggin', (req, res)=>{
    console.log(req.body)
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    async function find(){
        User.exists({name: name, email: email, password: password}, function(err, result){
            if(result === null){
                console.log('no exist');
                res.redirect('/'); // <= inloggnings sidå
            } else {
                console.log('exist');
                res.redirect(''); // <= inglogga sido
            }
        })
    }
    find();
})

server.listen(port, ()=>{
    console.log('servers on port: ' + port)
});