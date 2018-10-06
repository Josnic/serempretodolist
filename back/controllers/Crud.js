var mongoose = require("mongoose");
var Task = require("../models/Task");


var TaskCRUD = {};

TaskCRUD.add = function(data, fn, socket) {
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
            fn({ ok: true, id: n });
            socket.broadcast.emit("add", { id: n, name: data.name, complete: false });
        }
    });
}


TaskCRUD.readAll = function(data, fn) {
    Task.find({}, null, { sort: { id: 'desc' } }, function(err, tasks) {
        if (err) {
            fn({ error: err });
        } else {
            fn({ ok: true, tasks: tasks })
        }
    });
}

TaskCRUD.delete = function(data, fn, socket) {
    var id = parseInt(data.id);
    Task.findOneAndRemove({ id: id }, function(err) {
        if (err) {
            fn({ error: err });
        } else {
            fn({ ok: true, id: data.id })
            socket.broadcast.emit("delete", { id: id });
        }
    })
}

TaskCRUD.removeCompleted = function(data, fn) {
    Task.remove({ complete: true }, function(err) {
        if (err) {
            fn({ error: err });
        } else {
            fn({ ok: true })
        }
    })
}

TaskCRUD.removeAll = function(data, fn) {
    Task.remove({}, function(err) {
        if (err) {
            fn({ error: err });
        } else {
            fn({ ok: true })
        }
    })
}

TaskCRUD.update = function(data, fn, socket) {
    var id = parseInt(data.id);
    var objUpdate = {
        complete: data.complete
    }
    Task.findOneAndUpdate({ id: id }, objUpdate, function(err, task) {
        console.log(err)
        if (err) {
            fn({ error: err });
        } else {
            fn({ ok: true, id: data.id })
            socket.broadcast.emit("update", { id: id, complete: data.complete })
        }
    });
}


module.exports = TaskCRUD;