const { nanoid } = require("nanoid");

// Collections Name
const dbUsers = "users";
const dbSessions = "sessionId";
const dbTimers = "timers";

function oneTimerActive(element) {
  const progress = Date.now() - Number(element.start);
  const obj = {
    id: element.id,
    userId: element.userId,
    description: element.description,
    start: Number(element.start),
    end: Number(element.end),
    is_active: element.is_active,
    duration: Number(element.duration),
    progress: progress,
  };
  return obj;
}

async function createUserDB(db, user) {
  const data = await db.collection(dbUsers).insertOne({
    userId: user._id,
    username: user.username,
    password: user.password,
  });
  return data;
}

async function selectUserDB(db, username) {
  const user = await db.collection(dbUsers).findOne({
    username: username,
  });
  return user;
}

async function createSessionDB(db, id) {
  const sessionId = nanoid();
  await db.collection(dbSessions).insertOne({
    userId: id,
    session_id: sessionId,
  });
  return sessionId;
}

async function deleteSessionDB(db, sessionId) {
  const data = await db.collection(dbSessions).deleteOne({
    session_id: sessionId,
  });
  return data;
}

async function findUserSessionIdDB(db, sessionId) {
  const user_id = await db.collection(dbSessions).findOne({
    session_id: sessionId,
  });
  if (!user_id) {
    return false;
  }
  const user = await db.collection(dbUsers).findOne({
    userId: user_id.userId,
  });
  return user;
}

async function findUserTimersDB(db, userId) {
  const userTimers = await db
    .collection(dbTimers)
    .find({
      userId: userId,
    })
    .toArray();
  return userTimers;
}

async function timerSaveDB(db, timer) {
  const data = await db.collection(dbTimers).insertOne({
    userId: timer.userId,
    id: timer.id,
    description: timer.description,
    start: timer.start,
    end: timer.end,
    duration: timer.duration,
    is_active: timer.isActive,
  });
  return data;
}

async function timerFind(db, timer_id) {
  const data = await db.collection(dbTimers).findOne({
    id: timer_id,
  });
  return data;
}

async function timerStopSave(db, timer) {
  const data = await db.collection(dbTimers).updateOne(
    {
      id: timer.id,
    },
    {
      $set: {
        end: timer.end,
        duration: timer.duration,
        is_active: timer.is_active,
      },
    },
    {
      upsert: true,
    }
  );
  return data;
}

module.exports = {
  oneTimerActive,
  createUserDB,
  selectUserDB,
  createSessionDB,
  deleteSessionDB,
  findUserSessionIdDB,
  findUserTimersDB,
  timerSaveDB,
  timerFind,
  timerStopSave,
};
