const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
    },
    userName: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    refreshTokens: [{ token: { type: String } }],
    googleId: String,
  },
  { timestamps: true }
)

userSchema.statics.findByCredentials = async function (userName, password) {
  const user = await this.findOne({ userName })

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) return user
    else return null
  } else return null
}

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

userSchema.pre("save", async function (next) {
  const user = this
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10)
  }
  next()
})

module.exports = mongoose.model("User", userSchema)
