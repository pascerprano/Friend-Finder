const mongoose = require('../../config/Database');

var ObjectId = mongoose.Schema.Types.ObjectId;

const schema = {
    thread:{
        type: ObjectId,
        ref: 'thread',
        required: true
    },
    send: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    created_by: {
        type: String,
        required: true
    },
    is_deleted: [{
        type: String,
    }]
};

const collectionName = "message"; // Name of the collection of documents
const userSchema = mongoose.Schema(schema);
const Message = mongoose.model(collectionName, userSchema);


module.exports = Message;