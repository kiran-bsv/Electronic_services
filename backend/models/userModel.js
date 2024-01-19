import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    location: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    isAdmin: {type: Boolean, default: false, required: true}
},
{
    timestamps: true,
}
);


const User = mongoose.model("User", userSchema);

export default User;