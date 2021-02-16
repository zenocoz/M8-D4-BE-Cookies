const UserModel = require("../users/schema")
const atob = require("atob")

const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    const error = new Error("Please provide a basic authentication")
    error.httpStatusCode = 401
    next(error)
  } else {
    const [email, password] = atob(
      req.headers.authorization.split(" ")[1]
    ).split(":")

    const user = await UserModel.findByCredentials(userName, password)
    if (!user) {
      const error = new Error("Wrong credentials provided")
      error.httpStatusCode = 401
      next(error)
    } else {
      req.user = user
    }

    next()
  }
}

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    const err = new Error("Admins Only!")
    err.httpStatusCode = 403
    next(err)
  }
}

module.exports = {
  basic: basicAuthMiddleware,
  adminOnly: adminOnlyMiddleware,
}
