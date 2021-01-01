const mongoose = require ("mongoose");

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"]
    },
 
    age: {
        type: Number,
        required: [true, "Please enter an age"]
    },
 
    address: {
        type: String,
        required: [true, "Please enter an address"]
    },

    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },

    password: {
        type: String,
        required: [true, "Please enter an password"],
        minLength: [4, "minimum password length is 4"]
    },

    status: {
        type: String
    }
 
    
 });

 module.exports = mongoose.model('Customer', customerSchema);