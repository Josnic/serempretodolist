var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    id: Number,
    name: String,
    complete: Boolean
});

var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;