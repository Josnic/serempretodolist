var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    id: Number,
    name: String,
    state: String
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;