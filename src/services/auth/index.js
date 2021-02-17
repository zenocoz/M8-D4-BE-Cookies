const jwt = require("jsonwebtoken")

const authenticate = async (user) => {
  try {
    console.log("authe")
    const accessToken = await generateJWT({ _id: user._id })
    return accessToken
  } catch (err) {
    console.log(err)
  }
}

//for generating tokens        default time unit in exp is milliseconds
const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) {
          reject(err)
        }
        resolve(token)
      }
    )
  )

//to verify the token

const verifyJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err)
      }
      resolve(decoded)
    })
  )

module.exports = { authenticate }
