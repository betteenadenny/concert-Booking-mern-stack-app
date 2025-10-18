const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        maxlength:[100,'Name cannot exceed 100 characters']
    },
    email:{
        type:String,
        required:[true,'Email  is required'],
        unique:true
    },
    password:{
        type:String,
        minlength:[6,'Minimum length is 6']
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;