// grab the packages that we need for the user model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// user schema
var UserSchema = new Schema({
  username: { type: String, required: true, lowercase: true, index: { unique: true } },
  password: { type: String, required: true, select: false }
});

// method to compare a given password with the database pwd
UserSchema.methods.comparePassword = function(password) {
  var user = this;
  console.log('comparepassword', password, user.password);

  if (password === user.password) {
    return true;
  } else {
    return false;
  }

};

// return the model
module.exports = mongoose.model('User', UserSchema);