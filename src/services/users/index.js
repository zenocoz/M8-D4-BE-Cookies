const express = require("express")
const UserModel = require("./schema")
const { adminOnly, basic } = require("../auth/authTools")
const { authenticate } = require("../auth/")
const { authorize } = require("../auth/tokensMiddleware")
const passport = require("passport")

const usersRouter = express.Router()

usersRouter.get("/", authorize, async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/me", basic, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(err)
  }
})

usersRouter.put("/me", basic, async (req, res, next) => {
  try {
    const updates = Object.keys(req.body)
    console.log("Updates ", updates)

    updates.forEach((update) => (req.user[update] = req.body[update]))
    await req.user.save()
    res.send(req.user)

    res.send(updates)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", basic, async (req, res, next) => {
  try {
    await req.user.deleteOne()
    res.status(204).send("Deleted")
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    //check credentials

    const { userName, password } = req.body
    const user = await UserModel.findByCredentials(userName, password)

    //generate token
    const accessToken = await authenticate(user)

    // send back tokens
    res.send({ accessToken })
  } catch {}
})

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      res.cookie("accessToken", req.user.tokens.accessToken, {
        httpOnly: true,
      })
      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        httpOnly: true,
        path: "/users/refreshToken",
      })

      res.status(200).redirect("http://localhost:3001/auth/signup")
    } catch (error) {
      next(error)
    }
  }
)

module.exports = usersRouter
