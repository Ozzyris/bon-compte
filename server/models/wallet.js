var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var wallet = new mongoose.Schema({
    creation_date: {type: Date, default: moment()},
    last_edit: {type: Date, default: moment()},
    status: {type: Boolean, default: true},
    name: {type: String},
    background_image: {type: String},
    member: [
        {
            user_id: {type: String},
            family_name: {type: String},
            given_name: {type: String},
            avatar: {type: String},
            last_edit: {type: Date, default: moment()},
            spending: {type: Number, default: 0},
            balance: {type: Number, default: 0},
        }
    ],
    transaction: [
        {
            creation_date: {type: Date, default: moment()},
            amount: {type: Number},
            description: {type: String},
            author: {
                user_id: {type: String},
                family_name: {type: String},
                given_name: {type: String},
                avatar: {type: String},
            },
        }
    ]
}, {collection: 'wallet'});

    wallet.statics.add_member_to_wallet = function( member, id ){
        return new Promise((resolve, reject) => {
            wallet.update({ _id: id }, {
                $push:{
                    'member': {
                        user_id: member.id,
                        family_name: member.family_name,
                        given_name: member.given_name,
                        avatar: member.avatar
                    }
                }
            }).exec()
            .then(session =>{
                resolve( true );
            })
        })
    };
    wallet.statics.update_member_amount_on_wallet = function( id, spending, balance ){
        return new Promise((resolve, reject) => {
            wallet.update({'member.user_id': id}, {
                '$set': {
                    'member.$.balance': balance,
                    'member.$.spending': spending,
                    'member.$.last_edit': moment(),
                    'last_edit': moment()
                }
            }).exec()
            .then(session =>{
                resolve( true );
            })
        })
    };
    wallet.statics.update_other_member_amount_on_wallet = function( id, balance ){
        return new Promise((resolve, reject) => {
            wallet.update({'member.user_id': id}, {
                '$set': {
                    'member.$.balance': balance,
                    'last_edit': moment()
                }
            }).exec()
            .then(session =>{
                resolve( true );
            })
        })
    };
    wallet.statics.add_transaction_to_wallet = function( transaction, id ){
        return new Promise((resolve, reject) => {
            wallet.update({ _id: id }, {
                $push:{
                    'transaction': {
                        creation_date: moment(),
                        amount: transaction.amount,
                        description: transaction.description,
                        author: {
                            user_id: transaction.author.user_id,
                            family_name: transaction.author.family_name,
                            given_name: transaction.author.given_name,
                            avatar: transaction.author.avatar,
                        }
                    }
                }
            }).exec()
            .then(session =>{
                resolve( true );
            })
        })
    };
    wallet.statics.get_walletdetail_from_id = function( id ){
        return new Promise((resolve, reject) => {
            this.findOne({ _id : id }, {'last_edit':1, '_id':1, 'name':1, 'background_image':1, 'member':1}).exec()
                .then( wallet => {
                    if( wallet ){
                        resolve( wallet )
                    }else{
                        reject({ message: 'Your id does not exist', code: 'id_not_exist'});
                    }
                })
        });
    }

    // TRANSACTION
    wallet.statics.get_all_transaction_from_id = function( id ){
        return new Promise((resolve, reject) => {
            this.findOne({ _id : id }, {'transaction':1}).sort({'creation_date': -1}).exec()
                .then( transaction => {
                    if( transaction ){
                        resolve( transaction.transaction )
                    }else{
                        reject({ message: 'Your id does not exist', code: 'id_not_exist'});
                    }
                })
        });
    }

var wallet = mongoose.DB.model('wallet', wallet);
module.exports.wallet = wallet;