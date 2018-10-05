var mongoose = require("mongoose");
var Task = require("../models/Task");


var Task = {};

Task.add = function(data, fn) {
    var d = new Date();
    var n = d.getTime();
    var newTask = new Task({
        id: n,
        name: data.name,
        complete: false
    });
    newTask.save(function(err) {
        if (err) {
            fn({ error: err });
        } else {
            fn({ ok: true, id: n })
        }
    });

}