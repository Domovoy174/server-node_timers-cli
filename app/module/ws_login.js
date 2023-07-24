const { nanoid } = require("nanoid");
const dataBase = require("../js/dataBase");
const myFunc = require("../js/myFunc");


async function login(message, dbName) {
  try {
    const { username, password } = message;
    const user = await dataBase.selectUserDB(dbName, username);
    if (!user || myFunc.hash(password) !== user.password) {
      result = {
        type: "auth_error",
        message: "Wrong username or password!",
      }
      return result
    } else {
      const sessionId = await dataBase.createSessionDB(dbName, user.userId);
      result = {
        type: "auth_success",
        message: "Logged in successfully!",
        sessionId,
        userId: user.userId
      }
      return result
    }
  } catch (error) {
    console.error(error);
    result = {
      type: "auth_error",
      message: "Error",
    }
    return result
  }
}

module.exports = {
  login
}
