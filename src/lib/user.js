var bcrypt = require('bcryptjs');
var storage = require('./simpleStorage');
var readDB = storage.readDB;
var writeDB = storage.writeDB;

async function createUser(username, password) {
  var db = readDB();
  
  var existingUser = null;
  var i;
  for (i = 0; i < db.users.length; i = i + 1) {
    if (db.users[i].username === username) {
      existingUser = db.users[i];
      break;
    }
  }
  
  if (existingUser) {
    throw new Error('用户名已存在');
  }
  
  var hashedPassword = await bcrypt.hash(password, 10);
  
  var newUser = {
    id: db.users.length + 1,
    username: username,
    password: hashedPassword,
    created_at: new Date().toISOString(),
  };
  
  db.users.push(newUser);
  writeDB(db);
  
  return newUser;
}

async function findUserByUsername(username) {
  var db = readDB();
  var i;
  for (i = 0; i < db.users.length; i = i + 1) {
    if (db.users[i].username === username) {
      return db.users[i];
    }
  }
  return null;
}

async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  createUser: createUser,
  findUserByUsername: findUserByUsername,
  verifyPassword: verifyPassword,
};
