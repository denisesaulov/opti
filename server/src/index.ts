import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import authRouter from "./routers/authRouter"
import carRouter from "./routers/carsRouter"
import configObject from "./config"
import {errorHandlerMiddleware} from "./middlewares/errorHandlerMiddleware"

const app = express()
const PORT = configObject.PORT || "3000"
const uri = configObject.MONGO_URI || ""


app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.json())
app.use(bodyParser.json())
app.use("/car", carRouter)
app.use("/auth", authRouter)

app.use(errorHandlerMiddleware)

async function start() {
   try {
    await mongoose.connect(uri, {dbName: configObject.DB_NAME})
    app.listen(PORT, () => {
      console.log(`server started on ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}
start()



