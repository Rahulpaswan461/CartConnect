require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const {connectMongoDB} = require("./connection")
const userRoute = require("./routes/user")
const productRoute = require("./routes/product")
const orderRoute = require("./routes/order")
const categoryRoute = require("./routes/category")
const {authJwt} = require("./middleware/jwt")
const errorHandler = require("./middleware/errorHandler")


const app = express()
const PORT = 8000 || process.env.PORT

// establis the connection between the database 

connectMongoDB(process.env.MONGO_URL)
.then(()=>console.log("mongoDB is connected"))
.catch((error)=>console.log("There is some error while connecting !!!"))

app.use(express.urlencoded({extended:false}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(authJwt())
app.use(errorHandler)
app.use('/public/upload',express.static(__dirname + '/public/upload'))


app.get("/",(req,res)=>{
    return res.send("From the Server")
})


app.use("/api/user",userRoute)
app.use("/api/order",orderRoute)
app.use("/api/product",productRoute)
app.use("/api/category",categoryRoute)

app.listen(PORT,()=>{
    console.log("Server is running at 8000")
})
