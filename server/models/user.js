var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var user = new mongoose.Schema({
    email: {type: String},
    given_name: {type: String},
    family_name: {type: String},
    avatar: {type: String},
    currency: {type: String, default: 'USD'},
    password: {type: String},
    last_edit: {type: Date, default: moment()},
    wallet: [],
    auth_record: {
        creation_date: {type: String},
        last_modification_date: {type: String},
        expiration_date: {type: String},
        keep_session: {type: Boolean, default: false},
        token: {type: String}
    }
}, {collection: 'user'});

    //COMMON
    user.statics.check_email = function( email ){
        return new Promise((resolve, reject) => {
            this.findOne({ email : email }).exec()
                .then( user => {
                    if( !user ){
                        resolve( true );
                    }else{
                        reject({ message: 'Your email already exist', code: 'email_duplicate'});
                    }
                })
        })
    };
    user.statics.get_password_from_email = function( email ){
        return new Promise((resolve, reject) => {
            this.findOne({ email : email }).exec()
                .then( user => {
                    if( user ){
                        resolve( user.password )
                    }else{
                        reject({ message: 'Your email does not exist', code: 'email_not_exist'});
                    }
                })
        });
    }
    user.statics.get_id_from_email = function( email ){
        return new Promise((resolve, reject) => {
            this.findOne({ email : email }).exec()
                .then( user => {
                    if( user ){
                        resolve( user._id );
                    }else{
                        reject({ message: 'Your email does not exist', code: 'email_not_exist'});
                    }
                })
        })
    };
    user.statics.get_id_from_session = function( session ){
        return new Promise((resolve, reject) => {
            this.findOne({ 'auth_record.token' : session }).exec()
                .then( user => {
                    if( user ){
                        resolve( user._id );
                    }else{
                        reject({ message: 'Your email does not exist', code: 'email_not_exist'});
                    }
                })
        })
    };
    user.statics.get_userdetail_from_id = function( id ){
        return new Promise((resolve, reject) => {
            this.findOne({ _id : id }).exec()
                .then( user => {
                    if( user ){
                        resolve( user )
                    }else{
                        reject({ message: 'Your id does not exist', code: 'id_not_exist'});
                    }
                })
        });
    }


    //SESSION
    user.statics.save_session_from_id = function (session, user_id){
        return new Promise((resolve, reject) => {
            user.update({ _id: user_id }, {
                auth_record: {
                    creation_date: moment(),
                    last_modification_date: moment(),
                    expiration_date: session.expiration_date,
                    keep_session: session.keep_session,
                    token: session.token
                }
            }).exec()
            .then(session =>{
                resolve(true);
            })
        });
    }
    user.statics.get_auth_from_session = function( session ){
        return new Promise((resolve, reject) => {
            this.findOne({ 'auth_record.token': session }).exec()
                .then( user => {
                    if( user ){
                        let cleaned_token = {
                            creation_date: user.auth_record.creation_date,
                            last_modification_date: user.auth_record.last_modification_date,
                            expiration_date: user.auth_record.expiration_date,
                            keep_session: user.auth_record.keep_session,
                            token: user.auth_record.token,
                        }
                        resolve( cleaned_token );
                    }else{
                        reject({ message: 'Your session does not exist', code: 'xtoken_not_exist'});
                    }
                })
        });
    }
    user.statics.update_token_timestamp_from_xtoken = function( xtoken, session ){
        return new Promise((resolve, reject) => {
            user.update({ 'auth_record.token': xtoken }, {
                'auth_record.last_modification_date': moment(),
                'auth_record.expiration_date': session.expiration_date,
            }).exec()
            .then(session =>{
                resolve(true);
            })
        });
    }


    //WALLET
    user.statics.link_wallet_from_id = function( wallet_id, user_id ){
        return new Promise((resolve, reject) => {
            user.update({ _id: user_id }, {
                $push:{
                    'wallet': wallet_id
                }
            }).exec()
            .then (wallet => {
                resolve( true );
            })
        });
    }

var user = mongoose.DB.model('user', user);
module.exports.user = user;