const fs = require('fs');
const path = require('path')
const filemessenger = path.resolve('./data/discussion.json')

// Permet de recupérer la liste des discussions
function getDiscussion() {
  return new Promise((resolve) => {
    fs.readFile(filemessenger, 'utf-8', (err, data) => {
      let message = [] 
      try {
        message = (JSON.parse(data))
      } catch (e) {
        //do nothing
      }
      resolve(message)
    })
  })
}

// Permet d'écrire dans la liste des discussions
function saveDiscussion(messages) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filemessenger, JSON.stringify(messages), (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve(messages)
    })
  })
}

module.exports = {
  getDiscussion,
  saveDiscussion
}