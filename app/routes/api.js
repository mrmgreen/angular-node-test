var User = require('../models/user'),
  jwt = require('jsonwebtoken'),
  config = require('../../config');

var superSecret = config.secret;

module.exports = function(app,express) {
// get an instance of the express router
  var apiRouter = express.Router();

// route for authentication users
  apiRouter.post('/authenticate', function(req,res){

    var ip = req.ip;
    var unixTimestamp = Date.now();

    // changing the username to lowercase to make case insensitive.
    var inputUsername = req.body.username;
    var inputUsernameLowercase = inputUsername.toLowerCase();

    // find the user
    // select the username and password explicitly
    User.findOne({
      username: inputUsernameLowercase }).select('username password').exec(function(err,user) {
      if (err) throw err;

      // no user with that username was found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found',
          action: 'AUTH_FAILURE',
          ip: ip,
          dateTime: unixTimestamp,
          username: inputUsername
        })
      } else if (user) {

        //check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.',
            action: 'AUTH_FAILURE',
            ip: ip,
            dateTime: unixTimestamp,
            username: inputUsername
          });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign({
            username: user.username
          }, superSecret, {
            expiresInMintues: 1440 //expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'token granted',
            action: 'AUTH_SUCCESS',
            token:token,
            ip: ip,
            dateTime: unixTimestamp,
            username: inputUsername
          });
        }
      }

    });
  });

// route middleware to verify a token
  apiRouter.use(function(req,res,next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query['token'] || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, superSecret, function(err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;

          next();
        }
      })
    } else {

      // if there is no token
      // return an HTTP response if 403 (access forbidden) and an error message
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

// test route to make sure everything is working
// access at GET 8080/api
  apiRouter.get('/', function(req,res) {
    res.json({ message: 'hooray! welcome to my api.'});
  });

// on routes that end in /users
// -----------------------------------------------------
  apiRouter.route('/users')

    // create a user (access at POST loclhost://8080/api/users)
    .post(function(req,res) {

      // create a new instance of the User model
      var user = new User();

      // set the users information (comes from the request)
      user.username = req.body.username;
      user.password = req.body.password;

      // save the user and check for errors
      user.save(function(err) {
        if (err) {
          // duplicate entry
          if(err.code === 11000)
            return res.json({ success: false, message: 'A user with that username already exists. '});
          else
            return res.send(err);
        }

        res.json({ message: 'User created!' });
      });
    })

    //get all the users (accessed at GET 8080/api/users)
    .get(function(req,res) {
      User.find(function(err,users) {
        if (err) res.send(err);

        // return the users
        res.json(users);
      });
    });

  apiRouter.route('/users/:user_id')

    // get the user with that id
    // (accessed at GET 8080/api/users/:user_id)
    .get(function(req,res) {
      User.findById(req.params.user_id, function(err,user) {
        if (err) res.send(err);

        // return that user
        res.json(user);
      });
    })

    // update the user with this id
    // accessed at PUT 8080/api/users/:user_id
    .put(function(req,res) {

      // use our user model to find the user we want
      User.findById(req.params.user_id, function(err, user) {

        if(err) res.send(err);

        //update the users info only if its new
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;

        //save the user
        user.save(function(err) {
          if(err) res.send(err);

          // return a message
          res.json({ message: 'User updated.' });
        });
      });
    })

    // delete the user with this id
    // (accessed at DELETE 8080/api/users/:user_id)
    .delete(function(req,res) {
      User.remove({
        _id: req.params.user_id
      }, function(err,user) {
        if (err) return res.send(err);

        res.json({ message: 'Successfully deleted' });
      });
    });

  // api endpoint to get user information
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;
};