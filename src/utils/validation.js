
const validator = require('validator');

const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {

        throw new Error("First name and last name are required");
    
    } else if (!validator.isEmail(emailId) ){

        throw new Error("Email is Invalid");

    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough. It should be at least 8 characters" + 
            "long and include uppercase letters, lowercase letters, numbers, and symbols.");
    }

}

const validateEditProfileData = (req) => {

    const allowedEditFields = ['firstName', 'lastName', 'photoUrl', 'age', 'skills','gender'];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isEditAllowed;
}

module.exports = { validateSignUpData, validateEditProfileData}