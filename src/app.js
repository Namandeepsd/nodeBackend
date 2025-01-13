require('dotenv').config();

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


require("./db/conn")

const Register = require("./models/registers");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

console.log(process.env.SECRET_KEY,);

//console.log(path.join(__dirname,"../public"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});

//create new user in DB 
app.post("/register", async (req, res) => {
    try {
      //  console.log(req.body.firstName);
       // res.send(req.body.firstName); 
        const password = req.body.password;
        const conPass = req.body.confirmPassword;

        if (password === conPass) {
            const registerEmpoyee = new Register({
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmPassword,
            })

            //password hash-> middleware
            //token generate

            console.log("the success part is "+ registerEmpoyee);
            const token = await registerEmpoyee.generateAuthToken();
            console.log("Register token part "+ token);




            const register = await registerEmpoyee.save();
            res.status(201).render("index");
        }
        else {
            res.send("passwords don't match");
        }

    } catch (error) {
        res.status(400).send(error);
        console.log("error part page");
    }
});

//login chk

app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        console.log(`${email} & ${password}`);


        const emailo = await Register.findOne({ email: email });
        //res.send(emailo.password);
        // console.log(emailo);

        const isMatch = await bcrypt.compare(password, emailo.password);

        const token = await emailo.generateAuthToken();
        console.log("Login token part "+ token);

        if (isMatch) {
            res.status(201).render("index");
        }
        else {
            res.send("Invalid Password Details");
        }


    } catch (error) {
        res.status(400).send("Invalid Entry");
    }
});



const securePassword = async (password) => {
    const pass = await bcrypt.hash(password, 10);
    console.log(pass);

    const passMatch = await bcrypt.compare(password, pass);
    console.log(passMatch);
}
securePassword("Naman@123");



const createToken = async () => {
    const token = await jwt.sign({ _id: "67827a3cd0c3c8012ef09313" }, process.env.SECRET_KEY, {
        expiresIn:"2 minutes"
    });
    console.log("token is " + token);
    
    const userVer = await jwt.verify(token, "thisissecretkeyforthejwtlessonforytreg");
    console.log(userVer);
}

createToken();


app.listen(port, () => {
    console.log(`Server is running ${port}`);
});
