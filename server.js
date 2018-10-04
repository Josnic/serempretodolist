//archivo main
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require("path");

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

var mongoose = require('mongoose');
var config = require('./config/config');

const options = {

    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};
mongoose.connect(config.database, options); // connect to database


//servir archivos estaticos
app.use(express.static(path.join(__dirname, '/views')));

//adición de rutas
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.get(["/index", "/index.html"], function(req, res) {
    res.redirect("/");
})

app.get("/home", function(req, res) {

})

app.get("/home.html", function(req, res) {
    res.redirect("/home");
})

app.get("errorLogin", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/errorLogin.html"));
})

app.post("/login", function(req, res) {
    if (!req.query.username || !req.query.password) {
        res.redirect("/errorLogin");
    } else {
        var Login = require("./controllers/Login");
        Login.validateUser(req, res);
    }
})

app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/index");
})


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function(req, res) {
    res.status(404).send('La url solicitada no se encuentra.');
});

var port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});