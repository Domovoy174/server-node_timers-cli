const dataBase = require("../js/dataBase");

async function logout(sessionId, dbName) {
  try {
    let result = null;
    await dataBase.deleteSessionDB(dbName, sessionId);
    result = {
      type: "logout_success",
      message: "Logged out successfully!"
    }
    return result
  } catch (error) {
    result = {
      type: "logout_error",
      message: "Logged out BD - ERROR",
    }
    return result
  }
}

module.exports = {
  logout
}
