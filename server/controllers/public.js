const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  user_model = require('../models/user').user,
	  wallet_model = require('../models/wallet').wallet;

// HELPERS

// MIDDLEWARE
var check_auth = require('../middlewares/auth').check_auth;
router.use( check_auth );
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	// WALLET
	router.put('/add-wallet', function (req, res) {
		let wallet = {
				name: req.body.name
			},
			user = {};

		new wallet_model(wallet).save()
			.then( wallet_detail => {
				console.log( wallet_detail._id );
				wallet.id = wallet_detail._id;
				return user_model.get_id_from_session( req.headers['x-auth-token'] );
			})
			.then( user_id => {
				user.id = user_id;
				return user_model.get_userdetail_from_id( user_id );
			})
			.then( user_detail => {
				user.family_name = user_detail.family_name;
				user.given_name = user_detail.given_name;
				user.avatar = user_detail.avatar;

				return wallet_model.add_member_to_wallet( user, wallet.id );
			})
			.then( is_member_added => {
				return user_model.link_wallet_from_id( wallet.id, user.id);
			})
			.then( is_member_added => {
				res.status(200).json({message: 'Wallet created 💰'});	
			})
			.catch( error => {
				res.status(401).json( error );
			})
	});
	
	router.get('/get-wallet', function (req, res) {
		user_model.get_id_from_session( req.headers['x-auth-token'] )
			.then( user_id => {
				return user_model.get_userdetail_from_id( user_id );
			})
			.then( user_detail => {
				console.log( user_detail.wallet[0] );
				return wallet_model.get_walletdetail_from_id( user_detail.wallet[0] );
			})
			.then( wallet_detail => {
				console.log( wallet_detail );
				res.status(200).json(wallet_detail);
			})
			.catch( error => {
				res.status(401).json( error );
			})
	});

	router.post('/add-member-to-wallet', function (req, res) {
		var user = {
			id: req.body.user_id
		};

		user_model.get_userdetail_from_id( user.id )
			.then( user_detail => {
				user.family_name = user_detail.family_name;
				user.given_name = user_detail.given_name;
				user.avatar = user_detail.avatar;

				return wallet_model.add_member_to_wallet( user, req.body.wallet_id );
			})
			.then( is_member_added => {
				return user_model.link_wallet_from_id( req.body.wallet_id, user.id);
			})
			.then( is_member_added => {
				res.status(200).json({message: 'Member added to wallet 💰'});	
			})
			.catch( error => {
				res.status(401).json( error );
			})
	});

	router.post('/get-user-values', function (req, res) {
		var filtered_members = {
			user_details:{},
			partner_details: []
		},
		user_id;

		user_model.get_id_from_session( req.headers['x-auth-token'] )
			.then( id => {
				user_id = id;
				return wallet_model.get_walletdetail_from_id( req.body.wallet_id );
			})
			.then( wallet_detail => {
				for(var i = 0; i <= wallet_detail.member.length - 1; i++){
					
					if( wallet_detail.member[i].user_id ==  user_id){
						console.log( 'alex' );
						filtered_members.user_details = wallet_detail.member[i];
					}else{
						filtered_members.partner_details.push( wallet_detail.member[i] )
					}
				}

				res.status(200).json(filtered_members);
			})
			.catch( error => {
				res.status(401).json( error );
			})
	});

module.exports = {
	"public" : router
};