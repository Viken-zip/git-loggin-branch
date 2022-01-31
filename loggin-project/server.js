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
    const name = req.body.txtUserName
    const email = req.body.txtEmail
    const password = req.body.txtPassword
    
    async function find(){
        User.exists({name: name, email: email, password: password}, function(err, result){
            if(result === null){
                console.log('no exist');
                res.redirect('/'); // <= inloggnings sidå (failed to loggin)
            } else {
                console.log('logged in');
                res.redirect('shrek.html');    // <= inglogga sido (succesfully logged in)
                //res.redirect('reg.html');      // <= inglogga sido (succesfully logged in)
            }
        })
    }
    find();
})

server.post('/register', (req, res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    async function find(){
        User.exists({email: email}, function(err, result){
            if(result){
                console.log('email already in use');
                res.redirect('reg.html') // <= redirect när man faial med att göra ett konto
            } else {
                console.log('email is free');
                let data = new User({
                    name: name,
                    email: email,
                    password: password
                })
                data.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                })
                res.redirect('loggin.html') // <= redirect när man har skapa ett konto
            }
        })
    }
    find();
})

server.listen(port, ()=>{
    console.log('servers on port: ' + port)
});