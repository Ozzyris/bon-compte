var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var transaction = new mongoose.Schema({
    creation_date: {type: Date, default: moment()},
    status: {type: Boolean, default: true},
    description: {type: String},
    amount: {type: Number},
    author: {
        id: {type: String},
        first_name: {type: String},
        given_name: {type: String},
        avatar: {type: String},
    },
}, {collection: 'transaction'});




var transaction = mongoose.DB.model('transaction', transaction);

module.exports.transaction = transaction;