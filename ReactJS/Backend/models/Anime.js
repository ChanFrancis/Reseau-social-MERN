const mongoose = require('mongoose');

const animeSchema = mongoose.Schema({
    anime : {type : 'String', required: true},
    diffusion : {type : 'String'},
    genre : {type : 'String'},
    description : {type : 'String'},
    posterName : {type : 'String',},
})

module.exports = mongoose.model('Anime', animeSchema);