var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./back/config/config');
var sha1 = require("sha1");
var users = require("./back/models/User");

const options = {

    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
mongoose.connect(config.database, options); // connect to database
var admin = new users({
    name: 'admin',
    password: sha1('admin'),
    admin: true
});

admin.save(function(err) {
    if (err) throw err;

    console.log('User admin saved successfully');

});

var user = new users({
    name: 'user',
    password: sha1('user'),
    admin: false
});

user.save(function(err) {
    if (err) throw err;

    console.log('User no admin saved successfully');

});