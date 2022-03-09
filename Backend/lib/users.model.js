const fs = require('fs');
const path = require('path')
const filename = path.resolve('./data/users.json')

// Permet de recupérer la liste d'utilisateur
function getUsers() {
  return new Promise((resolve) => {
    fs.readFile(filename, 'utf-8', (err, data) => {
      let users = []
      try {
        users = JSON.parse(data)
      } catch (e) {
        //do nothing
      }
      resolve(users)
    })
  })
}

// Permet d'écrire des données dans la liste d'utilisateur
function saveUsers(users) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(users), (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve(users)
    })
  })
}


module.exports = {
  getUsers,
  saveUsers,
}