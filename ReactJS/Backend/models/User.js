const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   username : {type : 'string', required : true},
   email : {type : 'string', required : true, unique : true},
   password : {type : 'string', required : true},
   admin : {type : 'boolean', default : false},
   online : {type : 'boolean', default : false}
});


module.exports = mongoose.model('User', userSchema);