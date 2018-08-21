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
				name: req.body.name,
				background_image: req.body.background_image
			},
			user = {};

		new wallet_model(wallet).save()
			.then( wallet_detail => {
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
				return wallet_model.get_walletdetail_from_id( user_detail.wallet[0] );
			})
			.then( wallet_detail => {
				let array_of_wallet = [];
				array_of_wallet.push(wallet_detail);
				res.status(200).json(array_of_wallet);
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
				if(  user_detail.wallet.indexOf( req.body.wallet_id ) > -1){
					throw { message: 'You already subscibe to this wallet', code: 'wallet_duplicate'};
				}else{
					user.family_name = user_detail.family_name;
					user.given_name = user_detail.given_name;
					user.avatar = user_detail.avatar;
					return wallet_model.add_member_to_wallet( user, req.body.wallet_id );
				}
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

	router.post('/get-last-5-transactions', function (req, res) {
		wallet_model.get_all_transaction_from_id( req.body.wallet_id )
			.then( all_transactions => {
				let filtered_transaction = all_transactions;
				filtered_transaction.sort(function(a, b) {
					a = new Date(a.creation_date);
					b = new Date(b.creation_date);
					return a>b ? -1 : a<b ? 1 : 0;
				});
				filtered_transaction = filtered_transaction.slice(0, 5);


				console.log(filtered_transaction);
				res.status(200).json( filtered_transaction );
			})
			.catch( error => {
				res.status(401).json( error );
			})
	})

	router.post('/get-all-transactions', function (req, res) {
		wallet_model.get_all_transaction_from_id( req.body.wallet_id )
			.then( all_transactions => {
				let filtered_transaction = all_transactions;
				filtered_transaction.sort(function(a, b) {
					a = new Date(a.creation_date);
					b = new Date(b.creation_date);
					return a>b ? -1 : a<b ? 1 : 0;
				});

				res.status(200).json( all_transactions );
			})
			.catch( error => {
				res.status(401).json( error );
			})	
	})
	
	router.post('/add-transaction', function (req, res) {
		let transaction = {
			amount: req.body.amount,
			description: req.body.description,
			original_amount: {
				amount: req.body.original_amount.amount,
				currency: req.body.original_amount.currency
			},
			author: {}
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
						let spending = wallet_detail.member[i].spending,
							balance = wallet_detail.member[i].balance;
						spending = parseInt(spending) + parseInt(transaction.amount);
						balance = parseInt(balance) + (parseInt(transaction.amount) - (parseInt(transaction.amount) / wallet_detail.member.length));
						spending = Math.round(spending);
						balance = Math.round(balance);
						wallet_model.update_member_amount_on_wallet( user_id, spending, balance );
					}else{
						let balance = wallet_detail.member[i].balance;
						balance = parseInt(balance) - (parseInt(transaction.amount) / wallet_detail.member.length);
						balance = Math.round(balance);
						wallet_model.update_other_member_amount_on_wallet( wallet_detail.member[i].user_id, balance );
					}
				}

				return user_model.get_userdetail_from_id( user_id );
			})
			.then( user_detail => {
				transaction.author.user_id = user_detail._id;
				transaction.author.family_name = user_detail.family_name;
				transaction.author.given_name = user_detail.given_name;
				transaction.author.avatar = user_detail.avatar;

				return wallet_model.add_transaction_to_wallet( transaction, req.body.wallet_id );
			})
			.then( is_amount_updated => {
				res.status(200).json({message: 'New transaction added 💰'});
			})
			.catch( error => {
				res.status(401).json( error );
			})		
	})
	router.post('/delete-transaction', function (req, res) {
		let transaction = {}

		wallet_model.get_transactiondetail_from_id( req.body.transaction_id )
			.then( transaction_detail => {
				transaction = transaction_detail;
				return wallet_model.get_walletdetail_from_id( req.body.wallet_id )
			})
			.then( wallet_detail => {
				// Get USD amount 
				// addition the (total /nb of member) to the each member's balance
				// substracte the (total - you part) to your balance
				// substract the all amount to your spending

				// wallet_detail.member.length

				return wallet_model.delete_transaction_from_wallet( req.body.wallet_id, req.body.transaction_id );
			})
			.then( is_amount_updated => {
				res.status(200).json({message: 'New transaction added 💰'});
			})
			.catch( error => {
				res.status(401).json( error );
			})


	})

	router.post('/remove-transaction', function (req, res) {
		let transaction;

		wallet_model.get_transactiondetail_from_id( req.body.wallet_id, req.body.transaction_id )
			.then( transaction_detail => {
				console.log( transaction_detail );
			})
			.catch( error => {
				res.status(401).json( error );
			})
	})

module.exports = {
	"public" : router
};