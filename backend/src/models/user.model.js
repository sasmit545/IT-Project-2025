import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    }
    ,
    password: {
        type: String,
        required: true,
    }
    ,
    email: {
        type: String,
        required: true,
        unique: true,
    }
    ,
    websites:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Website'
        }
    ],
    refreshToken: {
        type: String,
        default: null
    }
    
},{ timestamps: true });

userSchema.pre("save",async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 11);
    }
    next()
});

userSchema.methods.isPasscorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.JWT_SECRET_AUTH,
        {
            expiresIn: process.env.JWT_EXPIRY_AUTH
        }
    );
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET_REFRESH,
        {
            expiresIn: process.env.JWT_EXPIRY_REFRESH
        }
    );
}



const User = mongoose.model("User", userSchema);

export default User;
