const express = require("express");
require("dotenv").config("../.env");
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 3330;

const dataBase = require("./js/dataBase");
const signup = require("./js/signup");

const app = express();

const http = require("http")
const WebSocket = require("ws");

const wsLogin = require("./module/ws_login");
const wsLogout = require("./module/ws_logout");
const wsTimers = require("./module/ws_timers");

const server = http.createServer(app)
const wsServer = new WebSocket.Server({ server })


// Connection URL
const uri = process.env.MONGODB_CONNSTRING;
const db_name = process.env.MONGODB_NAME;
const client = new MongoClient(uri);

const dbName = client.db(db_name)


app.use(async (req, res, next) => {
  try {
    req.db = client.db(db_name);
    next();
  } catch (error) {
    next(error);
  }
});

app.use(express.json());

app.use(express.static("public"));

app.use("/signup", signup);

wsServer.on("connection", (wsData) => {
  wsData.on("message", (message) => {
    try {
      message = JSON.parse(message)
    } catch (error) {
      console.log('---- error JSON parse ---')
    }

    if (message.type === "login") {
      const resData = wsLogin.login(message, dbName)
      resData.then((data) => {
        wsData.send(JSON.stringify(data))
        if (data.type === "auth_success") {
          const user = find(dbName, data.sessionId)
          user.then((resultUser) => {
            const resDataAllTimers = wsTimers.allTimers(resultUser.userId, dbName)
            resDataAllTimers.then((dataTimers) => {
              wsData.send(JSON.stringify(dataTimers))
            })
          })
        }
      })
    }

    if (message.type === "logout") {
      const resData = wsLogout.logout(message.sessionId, dbName)
      resData.then((data) => {
        wsData.send(JSON.stringify(data))
      })
    }

    if (message.type === "timer_start") {
      const user = find(dbName, message.sessionId)
      user.then((resultUser) => {
        if (!resultUser) {
          return
        }
        const resData = wsTimers.start(resultUser.userId, message.description, dbName)
        resData.then((data) => {
          wsData.send(JSON.stringify(data))
          const resDataAllTimers = wsTimers.allTimers(resultUser.userId, dbName)
          resDataAllTimers.then((dataTimers) => {
            wsData.send(JSON.stringify(dataTimers))
          })
        })
      })
    }

    if (message.type === "timer_stop") {
      const user = find(dbName, message.sessionId)
      user.then((resultUser) => {
        if (!resultUser) {
          return
        }
        const resData = wsTimers.stop(message.timerId, dbName)
        resData.then((data) => {
          wsData.send(JSON.stringify(data))
          const resDataAllTimers = wsTimers.allTimers(resultUser.userId, dbName)
          resDataAllTimers.then((dataTimers) => {
            wsData.send(JSON.stringify(dataTimers))
          })
        })
      })
    }
  })
})

async function find(dbName, sessionid) {
  const user = await dataBase.findUserSessionIdDB(dbName, sessionid);
  return user
}

server.listen(port, () => {
  console.log()
  console.log()
  console.log(`Server Listening on http://localhost:${port}`);
  console.log()
});
