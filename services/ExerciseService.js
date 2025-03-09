const Exercise = require('../models/Exercise')
const User = require('../models/User')

async function createExercise(
  userId,
  description,
  duration,
  date = new Date()
) {
  const exercise = new Exercise({userId, description, duration, date})
  const result = await exercise.save()
  const user = await User.findById(userId)

  return {
    _id: user.id,
    username: user.username,
    date: result.date.toDateString(),
    duration: result.duration,
    description: result.description
  }
}

async function getExercisesByUserId(userId, from, to, limit) {
  const exercises = Exercise.find({
    userId,
    date: {
      $gte: from || new Date(0),
      $lte: to || new Date()
    }
  }).limit(Number(limit))

  return exercises
}

module.exports = {
  createExercise,
  getExercisesByUserId
}