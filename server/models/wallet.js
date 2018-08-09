var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var wallet = new mongoose.Schema({
    creation_date: {type: Date, default: moment()},
    last_edit: {type: Date, default: moment()},
    status: {type: Boolean, default: true},
    name: {type: String},
    member: [
        {
            id: {type: String},
            avatar: {type: String},
        }
    ],
}, {collection: 'wallet'});




var wallet = mongoose.DB.model('wallet', wallet);

module.exports.wallet = wallet;