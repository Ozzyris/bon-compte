var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var user = new mongoose.Schema({
    last_name: {type: String},
    given_name: {type: String},
    avatar: {type: String},
    amount: {type: String},
    password: {type: String},
    last_edit: {type: Date, default: moment()},
    auth_record: {
        active_auth: {
            creation_date: {type: String},
            last_modification_date: {type: String},
            expiration_date: {type: String},
            keep_session: {type: Boolean, default: false},
            token: {type: String}
        },
        recorded_auth: [
            {
                creation_date: {type: String},
                last_modification_date: {type: String},
                ending_date: {type: String},
                keep_session: {type: String},
            }
        ]
    }
}, {collection: 'user'});




var user = mongoose.DB.model('user', user);

module.exports.user = user;