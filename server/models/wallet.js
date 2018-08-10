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
            user_id: {type: String},
            family_name: {type: String},
            given_name: {type: String},
            avatar: {type: String},
        }
    ],
    transaction: [
        {
            creation_date: {type: Date, default: moment()},
            amount: {type: Number},
            description: {type: String},
            author: {
                id: {type: String},
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
    wallet.statics.get_walletdetail_from_id = function( id ){
        return new Promise((resolve, reject) => {
            this.findOne({ _id : id }).exec()
                .then( wallet => {
                    if( wallet ){
                        resolve( wallet )
                    }else{
                        reject({ message: 'Your id does not exist', code: 'id_not_exist'});
                    }
                })
        });
    }

var wallet = mongoose.DB.model('wallet', wallet);
module.exports.wallet = wallet;