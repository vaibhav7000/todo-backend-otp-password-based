const mongoose = require("mongoose");

async function connectionWithDatabase(url) {
    try {
        const response = await mongoose.connect(url);
        return "connection with database is successfull";
    } catch (error) {
        throw error;
    }
}

// userSchema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:  true, // mongoDB will also check before adding document that it should be unique among all document if false will throw error
        lowercase: true, // all these actions are performed by mongoDB before inserting
        trim: true // all these actions are performed by mongoDB before inserting
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps:  true
})

// model creation from schema
const User = mongoose.model('User', userSchema);


module.exports = {
    connectionWithDatabase, User
}