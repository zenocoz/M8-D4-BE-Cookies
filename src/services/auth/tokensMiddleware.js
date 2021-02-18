const { verifyJWT } = require("./index.js")
const UserModel = require("../users/schema")

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")

    const decoded = await verifyJWT(token)

    const user = await UserModel.findOne({ _id: decoded._id })

    //write Errors
    if (!user) {
      throw new Error()
    }
    req.user = user
    req.token = token
    next()
  } catch (err) {}
}

module.exports = { authorize }
