const mongoose = require('../../config/Database');

const schema = {
    members:{
        type:[String],
        required: true
    },
    created_at:{
        type: Date,
        required: true
    },
    deleted_at:{
        type: Date
    },
};

const collectionName = "thread"; // Name of the collection of documents
const userSchema = mongoose.Schema(schema);
const Thread = mongoose.model(collectionName, userSchema);


module.exports = Thread;