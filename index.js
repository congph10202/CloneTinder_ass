var express = require('express');
var expressHBS = require('express-handlebars');

var app =express();

app.use(express.static('assets'));

app.engine('.handlebars', expressHBS());

app.set('view engine','.handlebars');
app.get('', function (req,res){
    res.render('index'); //file name
});
app.get('/home', function (req,res){
    res.render('index'); //file name
});
app.get('/signup.handlebars', function (req,res){
    res.render('signup'); //file name
});
app.get('/signin.handlebars', function (req,res){
    res.render('signin'); //file name
});
app.listen(process.env.PORT||4000);