/* Tjis file contains te user model */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case'); // Used to make our titlized
var validate = require('mongoose-validator'); // used to avlidate the user entries beforte they go to the database

// Check whether the name is valid
var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^[a-z\u00C0-\u02AB'´`]+\.?\s([a-z\u00C0-\u02AB'´`]+\.?\s?)+$/i,
    message: 'Must be at least 3 characters, max 30, no special characters or numbers, must have space in between the name.'
  })
];
// Check if it's an email
var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'The email provided is not valid.'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 30],
    message: 'The email should be between {ARGS[0]} and {ARGS[1]} characters.'
  })
];

// Check if the username is valid
var usernameValidator = [
  validate({
    validator: 'isAlphanumeric',
    message: 'The username must contain numbers and letters only.'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 30],
    message: 'The email should be between {ARGS[0]} and {ARGS[1]} characters.'
  })
];

var passwordValidator = [
  validate({
    validator: 'matches',
    arguments: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
    message: 'Password must be at least 8 characters, have one letter and one number.'
  }),
  validate({
    validator: 'isLength',
    arguments: [8, 35],
    message: 'The password should be between {ARGS[0]} and {ARGS[1]} characters.'
  })
];

var UserSchema = new Schema({
    name : {
        type: String,
        required: true,
        validate: nameValidator,
    },
    username : {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: usernameValidator,
    },
    password : {
        type: String,
        required: true,
        validate: passwordValidator,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: emailValidator,
    }
});

UserSchema.pre('save', function(next) {
    var user = this; //Whatever the user runs in the middleware
    bcrypt.hash(user.password, null, null, function(err, hash){
        user.password = hash;
        next();
    })
});

// This is used to csapitalize the names of my users
UserSchema.plugin(titlize, {
  paths: [ 'name' ], // Array of paths to titlize
});


/* The following will create a custom method for logging in */

UserSchema.methods.comparePasswords = function(password) {
    /* password is the one that the user entered
        this.password is the one we stored in the database */
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
