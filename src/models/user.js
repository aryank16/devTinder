
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
        minLength: 4,
        maxLength: 30,
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

    userSchema.methods.getJWT = async function() {

        const user = this;

        const token = await jwt.sign({_id: user._id}, 'DEV@Tinder$790',{
            expiresIn: "7d"
        });
        return token;
    }

    userSchema.methods.validatePassword = async function(passwordInputByUser) {


        const user = this;
        const passwordHash = user.password;



        const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
        return isPasswordValid;
    }

 module.exports = mongoose.model('User', userSchema);

