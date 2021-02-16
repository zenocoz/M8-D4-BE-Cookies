const express = require("express")

const server = express()

const port = process.env.PORT || 3005

server.listen(port, () => {
  console.log("server listening on port " + port)
})
