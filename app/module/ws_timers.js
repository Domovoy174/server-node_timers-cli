const { nanoid } = require("nanoid");
const dataBase = require("../js/dataBase");

async function start(userId, description, dbName) {
  try {
    const desc = description;
    let oneTimer = {
      id: `${nanoid()}`,
      userId,
      description: desc,
      start: `${Date.now()}`,
      end: "",
      duration: "",
      isActive: "1",
    };
    await dataBase.timerSaveDB(dbName, oneTimer);
    await dataBase.timerFind(dbName, oneTimer.id);
    result = {
      type: "timer",
      message: `Started timer ${desc}`,
      timer_id: oneTimer.id,
    }
    return result
  } catch (error) {
    result = {
      type: "timer_error",
      message: "Error",
    }
    return result
  }
}

async function stop(timerId, dbName) {
  try {
    let timer = await dataBase.timerFind(dbName, timerId);
    timer.is_active = "0";
    timer.end = `${Date.now()}`;
    timer.duration = `${Number(timer.end) - Number(timer.start)}`;
    await dataBase.timerStopSave(dbName, timer);

    result = {
      type: "timer",
      message: `Timer stopped`,
      timer_id: timerId
    }
    return result
  } catch (error) {
    result = {
      type: "timer_error",
      message: `ID timer not recognized: ${timerId} `,
      timer_id: timerId
    }
    return result
  }
}

async function allTimers(userId, dbName) {
  try {
    let userTimers = await dataBase.findUserTimersDB(dbName, userId);
    if (!userTimers === false) {
      let activeTimers = [];
      let allTimers = [];
      let oldTimers = [];
      for (let key in userTimers) {
        if (userTimers[key].is_active === "1") {
          activeTimers.push(dataBase.oneTimerActive(userTimers[key]));
        } else {
          oldTimers.push(dataBase.oneTimerActive(userTimers[key]));
        }
        allTimers.push(dataBase.oneTimerActive(userTimers[key]))
      }
      result = {
        type: "all_timers",
        message: `All timers`,
        activeTimers,
        oldTimers
      }
      return result
    } else {
      result = {
        type: "timer_error",
        message: `not user `,
      }
      return result
    }
  } catch (error) {
    result = {
      type: "timer_error",
      message: `Status isActive not recognized`,
    }
    return result
  }
}

module.exports = {
  start,
  stop,
  allTimers,
}
