const User = require('../models/User')

async function createUser(username) {
  const user = new User({username})
  const { id } = await user.save()

  return {
    username,
    _id: id
  };
}

async function getUsers() {
  const users = (await User.find()).map(user => ({
    username: user.username,
    _id: user.id
  }))

  return users
}

async function getUser(userId) {
  const user = await User.findById(userId)
  return user
}

module.exports = { createUser, getUsers, getUser }