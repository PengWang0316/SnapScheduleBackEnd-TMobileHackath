const gcal = require('google-calendar');

const JWTUtil = require('../utils/JWTUtil');

module.exports = (req, res) => {
  const { googleToken } = JWTUtil.verifyJWT(req.query.jwt, res);
  const googleCalendar = new gcal.GoogleCalendar(googleToken);
  // console.log('googleToken:', googleToken);
  googleCalendar.calendarList.list((err, calendarList) => {
    if (calendarList && calendarList.items && calendarList.items[0]) {
      googleCalendar.events.list(calendarList.items[0].id, (erra, calendarEvents) => {
        res.json(calendarEvents);
      });
    } else res.end();
  });
};
