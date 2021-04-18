
var express = require('express');
var expressHBS = require('express-handlebars');
var app =express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
// mongoose
const uri = "mongodb+srv://admin:admin@cluster0.o7wbn.mongodb.net/tinder?retryWrites=true&w=majority";
// getting-started.js
const mongoose = require('mongoose');

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection er' +
    'ror:'));
db.once('open', function() {
    // we're connected!
    console.log('Connected'); // kiểm tra xem đã kết nối được với thư viện mogoose chưa
});
var multer = require('multer');
//uploads single
var upload = multer({
    dest:'uploads/',
});
var user = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    age: String,
    phone: String,
    address: String,
    hobbies : String,
    pet :String,
})

app.use(express.static('assets'));

app.engine('.handlebars', expressHBS());

app.set('view engine','.handlebars');
app.listen(process.env.PORT||4000);

//--------- get("/") ---
app.get('', function (req,res){
    res.render('index'); //file name
});

app.get('/signup', function (req,res){
    res.render('signup'); //file name
});
app.get('/signin', function (req,res){
    res.render('signin'); //file name
});
app.get('/trangchu', function (req,res){
        res.render('home'); //file name
});
//get home -> user
app.get('/home', function (req,res){
    res.render('home'); //file name
});
app.get('/infor', function (req,res){
    res.render('myInfor'); //file name
});
app.get('/l_oStart', function (req,res){
    res.render('layoutStart'); //file name
});
app.get('/add_user', function (req,res){
    res.render('addUser'); //file name
});

// post login lên mogoose
app.post('/home', function (req,res){

    var userConnect = db.model('tests', user);
    userConnect({
        username:req.body.username,
        password:req.body.password,
    }).save(function (error) {
        if (error) {
            console.log('Loi' + error);

        } else {
            res.render('home',{loi:'thanh cong'});
            console.log('Thanh cong')
        }
    })
    console.log(req.body.userName);
});
//post data user lên mogoose
app.post('/addUsers', function (req,res){
    //add user
    var userConnect = db.model('user_names', user);
    userConnect({
        username:req.body.username,
        name :req.body.name,
        age :req.body.age,
        address :req.body.address,
        phone :req.body.phone,
        hobbies :req.body.hobbies,
        pet : req.body.pet,
    }).save(function (error) {
        if (error) {
            console.log('Loi' + error);
        } else {
            res.render('addUser',{loi:'thanh cong'});
            console.log('Thanh cong');
            console.log(req.body);
        }
    })
    console.log()


});
//function updateUsers
function updateUsers(req,res){
    var userModel = db.model('user_names', user);
    userModel.findOneAndUpdate({_id:req.body},req.body,{new : true},( err, doc)=>{
        if(!err){
            res.redirect('l_user');
        }else {
            console.log(err);
        }
    })
}

//get all data user
app.get('/l_user', (req, res)=>{
    var userModel = db.model('user_names', user);
    userModel.find({})
        .then(userlist => {
            res.render('listUser',{
                ups:userlist.map(user=>user.toJSON())
            });
        })
})

//update
app.get('/:id',(req,res)=>{
    var userModel = db.model('user_names', user);
    userModel.findById(req.params.id,(err,user)=>{
        if(!err){
            res.render('myInfor',{
                viewTitle : 'Update User',
                user:user.toJSON()
            })
        }
    })
})
//post update
app.post('/updateuser',(req,res)=>{
    var userModel = db.model('user_names', user);
    userModel.findOneAndUpdate({_id:req.body.id},req.body,{new : true},( err, doc)=>{
        if(!err){
            res.redirect('l_user');
            console.log("ok");
        }else {
            console.log(err);
        }
    })
})

//delete
// get delete
app.get('/delete/:id', async (req,res)=> {

    try {
        var userModel = db.model('user_names', user);
        const users = await userModel.findByIdAndDelete(req.params.id, req.body);
        if (!users) {
            res.status(404).send('No item found');
        } else {
            res.redirect('/l_user')
        }
    } catch (err) {
        res.status(500).send(err);
    }
})