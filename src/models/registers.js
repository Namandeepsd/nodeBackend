const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },  
    age: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
       // required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

//generating tokens
employeeSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token})
        //  console.log(token);
        await this.save();
        return token;
    } catch (error) {
        res.send(`the error part is ${error}`);
        console.log(`the error part is ${error}`);
    }
}

employeeSchema.pre("save", async function (next) {
    //  const passwordHash = await bcrypt.hash(password, 10);
    if (this.isModified("password")) {
        console.log(this.password);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(this.password);

        this.confirmpassword = await bcrypt.hash(this.password,10);
    }
    next();
});


const Register = new mongoose.model("Registra", employeeSchema);
module.exports = Register;