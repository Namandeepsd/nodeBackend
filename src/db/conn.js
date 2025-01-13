const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ytReg")
    .then(() => {
        console.log("connected to DB");
    })
    .catch((e) => {
        console.log(e);
    })