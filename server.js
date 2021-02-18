const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
const passport = require("passport")

const oauth = require("./src/services/auth/oauth") // hack to paste all the content of oauth

const usersRouter = require("./src/services/users")

const {
  notFoundHandler,
  forbiddenHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./src/services/errorHandlers")

const server = express()

server.use(cors())
const port = process.env.PORT || 3005

// const staticFolderPath = join(__dirname, "../public")
// server.use(express.static(staticFolderPath))
server.use(express.json())
server.use(passport.initialize())

server.use("/users", usersRouter)

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

// mongoose.set("debug", true)

mongoose
  .connect(process.env.MONGO_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Server running on port", port)
    })
  )
  .catch((err) => console.log(err))
