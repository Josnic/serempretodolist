var mongoose = require("mongoose");
var User = require("../models/User");
var sha1 = require("sha1");

var Login = {};

Login.validateUser = function(req, res) {
    var objS = {
        name: req.body.user,
        password: sha1(req.body.pass)
    }

    User.find(objS, function(err, user) {
        if (err) {
            res.redirect("/errorLogin");
        } else {
            //code
            if (user.length == 0) {
                res.redirect("/errorLogin");
            } else {
                req.session.user = req.body.user;
                req.session.admin = user[0].admin;
                res.redirect("/home");
            }
        }
    });

}

module.exports = Login;