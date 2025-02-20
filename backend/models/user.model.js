import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password only required if not Google auth
        }
    },
    googleId: {
        type: String,
        sparse: true
    },
    photoURL: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;