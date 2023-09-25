const mongoose = require('mongoose');

const comSchema = mongoose.Schema({
    commentaire :{type : 'String', required:true},
    pageID:{type : 'String'},
    type:{type : 'String'},
    userID:{type : mongoose.Schema.Types.ObjectId, ref: 'User' },
    date:{type : 'Date'},
})
    
module.exports = mongoose.model('com', comSchema)