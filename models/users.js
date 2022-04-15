const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    search_history: [
        {
            text: {
                type: String,
            },
            frequency: {
                type: Number
            }            
        }
    ]
}, {
    timestamps: true
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;