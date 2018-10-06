//archivo main
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require("path");
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
sharedsession = require("express-socket.io-session");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

session = require("express-session")({
        secret: "2C44-4D44-WppQ38S",
        resave: true,
        saveUninitialized: true
    }),
    sharedsession = require("express-socket.io-session");


// Attach session
app.use(session);

// Share session with io sockets
/*
io.use(sharedsession(session));

session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
*/
io.sockets.use(sharedsession(session));



var mongoose = require('mongoose');
var config = require('./back/config/config');

const options = {

    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};
mongoose.connect(config.database, options); // connect to database

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    console.log(req.session)
    if (req.session.user && req.session.admin !== null && req.session.user !== "undefined" && req.session.admin !== "undefined" && req.session.user !== "") {
        return next();
    } else {
        return res.sendStatus(401);
    }
};

//servir archivos estaticos
app.use('/js', express.static(__dirname + '/views/js'));
app.use('/css', express.static(__dirname + '/views/css'));

//adición de rutas
app.get("/index", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/index.html"));
});


app.get("/errorLogin", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/errorLogin.html"));
})

app.post("/login", function(req, res) {
    if (!req.body.user || !req.body.pass) {
        res.redirect(req.headers.origin + "/errorLogin");
    } else {
        var Login = require("./back/controllers/Login");
        Login.validateUser(req, res);
    }
})


app.get("/home", auth, function(req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html"));
})


app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/index");
})


app.get("/", function(req, res) {
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



var socketCount = 0

users = {}, socks = {};

io.sockets.on("connection", function(socket) {

    socketCount++;
    io.sockets.emit('users connected', socketCount);
    console.log(socket.id);
    socket.on("name user", function(data, fn) {
        fn(socket.handshake.session.user);
    })

    socket.on("add", function(data, fn) {
        var Task = require("./back/controllers/Crud");
        Task.add(data, fn, socket);
    })

    socket.on("readAll", function(data, fn) {
        var Task = require("./back/controllers/Crud");
        Task.readAll(data, fn);
    })

    socket.on("delete", function(data, fn) {
        var Task = require("./back/controllers/Crud");
        Task.delete(data, fn, socket);
    })

    socket.on("update", function(data, fn) {
        var Task = require("./back/controllers/Crud");
        Task.update(data, fn, socket);
    })

    socket.on("removeCompleted", function(data, fn) {
        var Task = require("./back/controllers/Crud");
        Task.removeCompleted(data, fn);
    })

    socket.on("removeAll", function(data, fn) {
        var Task = require("./back/controllers/Crud");
        Task.removeAll(data, fn);
    })


    //  console.log(socket.handshake.session.user);
    //console.log(socket.handshake.session.admin);
});



var port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});