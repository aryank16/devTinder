
const mongoose = require('mongoose');

const  validator = require('validator');

const userSchema = new mongoose.Schema({

    firstName:{
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30,

    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is Invalid" + value);
            }
        }
    },
    password:{
        type: String,
        required: true,
         validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough"+ value);
            }
        }
    },
    age:{
        type: Number,
        min: 18,
    },
    gender:{
        type: String,
        validate(value) {
            if(!["male","female", "others"].includes(value)) {
                throw new Error("Gender data is Invalid");

        }
    }
    },
    skills:{
        type: [String]
    },
    

},
{

    timestamps:true,
    });

 module.exports = mongoose.model('User', userSchema);

