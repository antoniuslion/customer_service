const mongoose = require ("mongoose");

const sessionSchema = mongoose.Schema({
    access_token: {
        type: String,
        required: [true]
    },
 
    refresh_token: {
        type: String,
        required: [true]
    },
 
    expired_date: {
        type: Date,
        required: [true]
    },

    refresh_token_expired: {
        type: Date,
        required: [true]
    },

    created_on: {
        type: Date,
        required: [true]
    },

    status: {
        type: String
    }
    
 });

 module.exports = mongoose.model('Session', sessionSchema);