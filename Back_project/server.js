const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./routers/userRouter")
const recetteRouter = require("./routers/recetteRouter")
const cors = require('cors')

const app =express()

app.use(cors())
app.use(express.json())
app.use(express.static('uploads'));
app.use(userRouter)
app.use(recetteRouter)

app.listen(3001, (err)=>{
    if (err){
        console.log(err);
    }
    else{
        console.log("connecter au port 3001");
    }
}
)

mongoose.connect("mongodb://127.0.0.1:27017/marmite")