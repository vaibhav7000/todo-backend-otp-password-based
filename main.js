const express = require("express");
const app = express();
const cors = require("cors");
const { connectionWithDatabase } = require("./db/database.js");
const signInRouter = require("./routes/AuthRoutes/signupRoute.js");
require('dotenv').config();

app.use(cors({
    origin: "*",
}))

app.use(express.json());

app.use("/sigin", signInRouter);

main();

app.use(function(err, req, res, next) {
    if(err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal server error"
        })
        return
    }
    next();
})


app.use(function(req, res, next) {
    res.status(404).json({
        msg: "Route does not exist"
    })
})

async function main() {
    try {
        const response = await connectionWithDatabase(process.env.db_URl); 
        console.log(response);
        app.listen(process.env.port, function() {
            console.log("Server is up");
        });
    } catch (error) {
        console.log(error);
        console.log("connecting with database failed");
        process.exit(1); // will stop the node js backend server
    }
}












