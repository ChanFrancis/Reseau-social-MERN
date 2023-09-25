const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    titre :{type : 'String', required:true},
    username :{type : 'String'},
    imagename :{type : 'String'},
    data_sortie :{type : 'Date'},
    description :{type : 'String'},
})
    
module.exports = mongoose.model('blog', blogSchema)