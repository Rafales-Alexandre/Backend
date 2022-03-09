const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const {getMessages, saveMessages} = require('./lib/message.model ')
const {getUsers, saveUsers} = require('./lib/users.model')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const {encrypted_key,decrypted_key} = require('./lib/cookiecrypt.model')
const {getDiscussion, saveDiscussion } = require('./lib/discussion.model')
const res = require('express/lib/response')

var date = new Date();

app.use(bodyParser.json())
app.use(cookieParser())

/**
 * create an user
 */
app.post('/users', async (req, res) => {
  if (!req.body.username ||
    !req.body.password ||
    typeof req.body.username !== "string" ||
    typeof req.body.password !== "string") {
    res.status(400).send({
      message:'bad request'
    })
    return
  }

  const users = await getUsers()
  for (const user of users) {
    if (user.username === req.body.username) {
      res.status(402).send({
        message: 'conflict'
      })
      return
    }
  }
// cryptage du password
  const password = req.body.password;
  const hashpassword = await bcrypt.hash(password, 12)
  res.send({hashpassword})
// 
  const newUser = {
    username: req.body.username,
    password: hashpassword
  }
  users.push(newUser)
  try {
    await saveUsers(users)
    res.status(201).send({
      user: newUser
    })
  } catch (e) {
    res.status(500).send(e)
  }
})


/**
 * user login
 */
app.post('/auth', async (req, res) => {
  if (!req.body.username ||
    !req.body.password ||
    typeof req.body.username !== "string" ||
    typeof req.body.password !== "string") {
    res.status(400).send({
      message: 'bad request'
    })
    return
  }
  const users = await getUsers()
  const user = users.find((user) => user.username === req.body.username)
  if (!user) {
    res.status(404).send({
      message: 'not-found'
    })
    return
  }
  const password = req.body.password;
  const isSame = await bcrypt.compare(password, user.password)
  if (!isSame) {
    res.status(400).send({
      message: 'bad-password'
    })
    return
  }
// Cryptage du cookie utilisateur
  const user_cookiecrypt_key = encrypted_key(user.username)
  res.cookie('auth', user_cookiecrypt_key , {expire: 360000 + Date.now()});
  res.send({
    user_cookiecrypt_key
  })
})

/**
 * Login check
 */
app.get('/users/me', (req, res) => {
  const user_decookiecrypt_key = decrypted_key(req.cookies.auth)
  res.send({
    user: user_decookiecrypt_key
  })
})

/**
 * Send message
 */
app.post('/messenger', async (req, res) => {
  if (!req.cookies.auth||
    !req.body.message ||
    typeof req.body.message !== "string") {
    res.status(400).send({
      message: 'bad request'
    })
    return
  }

  const messages = await getMessages()
  const user_decookiecrypt_key = decrypted_key(req.cookies.auth)
  const newMessage = {
    username: user_decookiecrypt_key,
    message: req.body.message,
  }
  messages.push(newMessage)
  try {
    await saveMessages(messages)
    res.status(201).send({
      message: newMessage
    })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
})

/**
 * Get messages
 */
app.get('/messenger', async(req, res) => {
  if (!req.cookies.auth
    ){
    res.status(400).send({
      message: 'bad request'
    })
    return
  }
  const messages = await getMessages()
  try {
    await saveMessages(messages)
    res.status(201).send({
      message: messages
    })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
})

/**
 * create discussion
 */
 app.post('/discus', async (req, res) => {
  if (!req.cookies.auth||
    !req.body.discussion ||
    typeof req.body.discussion !== "string") {
    res.status(400).send({
      message: 'bad request'
    })
    return
  }

  const messages = await getDiscussion()
  const user_cookiecrypt_key = decrypted_key(req.cookies.auth)
  for (const discus of messages) {
    if (discus.discussion === req.body.discussion) {
        res.status(400).send({
        message: 'bad-password'
      })
    }
  }
  const newMessage = {
    discussion: req.body.discussion,
    username: user_cookiecrypt_key.toString("utf-8"),
    date: date
  }
  messages.push(newMessage)
  try {
    await saveDiscussion(messages)
    res.status(201).send({
      message: newMessage
    })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}) 
/**
 * create cookie discussion
 */
app.post('/discus_auth', async(req,res) => {
  if (!req.body.discussion||
    typeof req.body.discussion !== "string"){
    res.status(400).send({
      message:'bad request'
    })
    return
  }

  const message = await getDiscussion()
  const discussion = message.find((discus) => discus.discussion === req.body.discussion)
  
  if (!discussion) {
    res.status(404).send({
      message:'not found'
    })
    return
  }

  const discussion_cookiecrypt_key = encrypted_key(discussion.discussion)

  res.cookie('discus_auth', discussion_cookiecrypt_key.toString('hex'),{expire: 36000 + Date.now()});
  res.send({
    discussion
  })
})

/**
 * Get discussion
 */
app.get('/discus', async(req, res) => {
  if (!req.cookies.auth||
    !req.body.discussion
    ){
    res.status(400).send({
      message: 'bad request'
    })
    return
  }
  const messages = await getDiscussion()
  try {
    await saveDiscussion(messages)
    res.status(201).send({
      message: messages
    })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
})

/**
 * Create message for discussion
 */
// app.post('/discus/messenger',async (req,res) => {
//   if (!req.cookies.auth ||
//     !req.cookies.discus_auth)
//   {
//     res.status(404).send({
//       message:'not found'
//     })
//     return
//   }
//   if (!req.body.message||
//     typeof req.body.message !=='string'){
//       res.status(400).send({
//         message:'bad request'
//       })
//       return
//     }
//     const messages = await getDiscussion()
//     const discussion_cookiecrypt_key = encrypted_key(req.cookies.auth)
//     const user_decookiecrypt_key = decrypted_key(req.cookies.discus_auth)

//     const newMessage ={
//       discussion: discussion_decookiecrypt_key.toString('utf-8'),
//       username: user_cookiecrypt_key.toString('utf-8'),
//       message: req.body.message,
//       date: date
//     }
//     messages.push(newMessage)
//     try{
//       await saveDiscussion(messages)
//       res.status(201).send({
//         message: newMessage
//       })
//     } catch(e) {
//       res.status(500).send(e)
//     }
// })

/**
 * Port listening
 */
app.listen(port, () => {
  console.log(`app started on the following url http://localhost:${port}`)
})
