const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    emitterID : {type: 'string'},
    receiverID : {type : 'String'},
    messages : {type : 'String'},
    date : {type : 'date'},
    vu : {type : 'boolean'},
})

module.exports = mongoose.model('messages', messagesSchema);