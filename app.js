const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));
var mongoose = require('mongoose');
//-----------------DATABASE CONNECTION-------------------
mongoose.connect('mongodb://localhost:27017/newProj', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection open");
    })
    .catch(err => {
        console.log("Something went wrong");
    })



app.set('view engine', 'ejs');

//-----------------DEFINING SCHEMA-----------------
const userSchema = new mongoose.Schema({
    sub_id: String,
    sub_name: String,
    sub_code: String,
    sub_prof: String
});

const passSchema = new mongoose.Schema({
    username: String,
    password: String
})
const user = mongoose.model('user', userSchema);

const pass = mongoose.model('pass', passSchema);

//-------------ROUTE FOR ADDING SUBJECT DETAILS----------
app.get("/add_subject", (req, res) => {
    res.render("add_subject");
})

//------------ROUTES FOR SEARCHING--------------------
app.get("/search", (req, res) => {
    res.render('find_form');
})
app.get("/find", (req, res) => {
    const { id } = req.query;
    user.findOne({ sub_id: id }, function (err, docs) {
        if (err) throw err;
        res.send(docs);
    })
})

//------------ROUTE FOR INSERTING DATA--------------------
app.post("/insert", (req, res) => {
    const data = new user({
        sub_id: req.body.sub_id,
        sub_name: req.body.sub_name,
        sub_code: req.body.sub_code,
        sub_prof: req.body.sub_prof
    });
    user.collection.insertOne(data);
    res.redirect("/show");
})

//---------------ACCOUNT CREATION-------------
app.get("/create", (req, res) => {
    res.render("signup");
})
app.post("/create_account", (req, res) => {
    const ob1 = new pass({
        username: req.body.username,
        password: req.body.password
    })
    pass.collection.insertOne(ob1);
    //res.send("User registered sucessfully");
    res.redirect("/login");
})

//---------------------Authenticate----------------
app.post("/authenticate", (req, res) => {
    const user = req.body.username;
    const pass1 = req.body.password;
    pass.findOne({ username: user, password: pass1 }, function (err, docs) {
        if (err) throw err;
        if (docs)
            res.redirect("/show");
        else
            res.send("Wrong username or password");
    })
})

//-----------------------Showing all subject details------------
app.get("/show", (req, res) => {
    user.find({}, function (err, docs) {
        if (err) throw err;
        res.render('show_all', { docs });
    })
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.listen(3000, () => {
    console.log("Listening on port 3000...");
})