var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// loginAttempts Schema
var LoginSchema = new Schema({
	IP: String,
	DateTime: Number,
	Action: String,
	Username: String
});

// return the model
module.exports = mongoose.model('loginAttempt', LoginSchema);