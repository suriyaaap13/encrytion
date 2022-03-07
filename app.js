require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] } );

const User = new mongoose.model("User", userSchema);


app.get('/', function(req,res){
    res.render('home');
});

app.route('/login')
.get(function(req,res){
    res.render('login');
})
.post(function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            console.log("Successfully found the user");
            if(foundUser.password === password){
                console.log("logged in successfully");
                res.render('secrets');
            }else{
                console.log("log in failed due to wrong password");
                res.redirect('/login');
            }
        }
    });
});

///// Register //////////////////////
app.route('/register')
.get(function(req,res){
    res.render('register');
})
.post(function(req, res){
    console.log(req.body);
    const userData = new User({
        email: req.body.username,
        password: req.body.password
    });
    userData.save(function(err){
        if(err){
            console.log("Error in saving the userData");
        }else{
            console.log("Successfully saved userData");
        }
    });
    res.redirect('/login');
});

app.listen(3000, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Server is up and running in port 3000");
    }
});