const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createUser, getUsers, getUser } = require('./services/UserService');
const { createExercise, getExercisesByUserId } = require('./services/ExerciseService');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  try {
    const username = req.body.username;
    const user = await createUser(username)

    res.json(user)
  } catch (err) {
    res.json({error: err.mesage})
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers()

    res.json(users)
  } catch (err) {
    res.json({error: err.mesage})
  }
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const userId = req.params['_id']
    const description = req.body.description
    const duration = req.body.duration
    const date = req.body.date

    const exercise = await createExercise(userId, description, duration, date)

    res.json(exercise)
  } catch (err) {
    res.json({error: err.message})
  }
})

app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const userId = req.params['_id']
    const from = req.query.from
    const to = req.query.to
    const limit = req.query.limit

    const user = await getUser(userId)
    const exercises = await getExercisesByUserId(userId, from, to, limit)

    res.json({
      _id: user.id,
      username: user.username,
      count: exercises.length,
      log: exercises.map(exercise => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      }))
    })
  } catch (err) {
    res.json({error: err.message})
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
