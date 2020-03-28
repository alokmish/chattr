const moment = require('moment');

function message(userName, text) {
  return {
    userName,
    text,
    timeStamp: moment().format('h:mm a'),
  };
}

module.exports = message;