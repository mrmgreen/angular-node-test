var LoginAttempt = require('../models/loginAttempts.js');

module.exports = function(app,express) {

    var loginAttemptRouter = express.Router();
    // Login attempt data
    loginAttemptRouter.route('/loginattempt')

    .post(function(req,res) {

      // create a new instance of the User model
      var loginAttempt = new LoginAttempt();

      // set the users information (comes from the request)
      loginAttempt.IP = req.body.ip;
      loginAttempt.DateTime = req.body.dateTime;
      loginAttempt.Username = req.body.username;
      loginAttempt.Action = req.body.action;

      console.log('loginAttempt', loginAttempt);
      // loginAttempt.Action = ;
      // loginAttempt.Username = req.body.username;

      loginAttempt.save(function(err) {
        if(err) {
          return res.send(err);
        }

        res.json({ message: 'loginAttempt saved'});
      });

    })

    .get(function(req,res) {
            LoginAttempt.find(function(err,loginAttempt) {
        if (err) res.send(err);

        // return the users
        res.json(loginAttempt);
      });
    });

  return loginAttemptRouter;
}