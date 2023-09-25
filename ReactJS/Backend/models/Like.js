const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    idUser :{type : 'String'},
    idManga :{type : 'String'},
})
    
module.exports = mongoose.model('like', likeSchema)