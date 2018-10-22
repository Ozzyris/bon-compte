const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  moment = require('moment'),
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
			.then( is_transaction_added => {
				res.status(200).json({message: 'New transaction added 💰'});
			})
			.catch( error => {
				res.status(401).json( error );
			})		
	})

	router.post('/remove-transaction', function (req, res) {
		let transaction = {};

		wallet_model.get_walletdetail_from_id( req.body.wallet_id )
			.then( wallet_detail => {
				for(var i = 0; i <= wallet_detail.transaction.length - 1; i++){
				    if( wallet_detail.transaction[i]._id == req.body.transaction_id){
				        transaction = wallet_detail.transaction[i];
				    }
				}
				for(var i = 0; i <= wallet_detail.member.length - 1; i++){
					if( wallet_detail.member[i].user_id == transaction.author.user_id){
						let spending = wallet_detail.member[i].spending,
							balance = wallet_detail.member[i].balance;
						spending = parseInt(spending) - parseInt(transaction.amount);
						balance = parseInt(balance) - (parseInt(transaction.amount) - (parseInt(transaction.amount) / wallet_detail.member.length));
						spending = Math.round(spending);
						balance = Math.round(balance);
						wallet_model.update_member_amount_on_wallet( wallet_detail.member[i].user_id, spending, balance );
					}else{
						let balance = wallet_detail.member[i].balance;
						balance = parseInt(balance) + (parseInt(transaction.amount) / wallet_detail.member.length);
						balance = Math.round(balance);
						wallet_model.update_other_member_amount_on_wallet( wallet_detail.member[i].user_id, balance );
					}
				}

				return wallet_model.remove_transaction_from_wallet( req.body.wallet_id, req.body.transaction_id );
			})
			.then( is_transaction_deleted => {
				res.status(200).json({message: 'Transaction deleted 💰'});
			})
			.catch( error => {
				res.status(401).json( error );
			})
	})

	router.post('/resolve-wallet', function (req, res) {
		let wallet_id,
			user_id,
			is_wallet_open,
			generation_date = moment();

		let debtor = [
				{
					name: 'user 1',
					balance: -1
				},
				{
					name: 'user 2',
					balance: -3
				},
				{
					name: 'user 3',
					balance: -5
				},
				{
					name: 'user 4',
					balance: -1
				}
			],
			creditor = [
				{
					name: 'user 5',
					balance: 6
				},
				{
					name: 'user 6',
					balance: 1
				},
				{
					name: 'user 7',
					balance: 3
				},
			],
			payments = [];

			debtor.sort(function(a, b) {
				a = a.balance;
				b = b.balance;
				return a<b ? 0 : 1;
			});
			creditor.sort(function(a, b) {
				a = a.balance;
				b = b.balance;
				return a<b ? 1 : 0;
			});

			console.log( debtor, creditor );

			for(var i = 0; i <= debtor.length - 1; i++){
				for(var j = 0; j <= creditor.length - 1; j++){
					if(debtor != 0){
						let amount,
							remaining;

						if( -(debtor[i].balance) > creditor[j].balance ){
							//debtor win
							remaining = debtor[i].balance + creditor[j].balance;
							amount = Math.abs(remaining - debtor[i].balance);
							console.log( 'debtor balance = ' + remaining);
							console.log( 'creditor balance = 0' );



						}else if( -(debtor[i].balance) < creditor[j].balance ){
							//creditor win
							remaining = debtor[i].balance + creditor[j].balance;
							amount = Math.abs(remaining - creditor[j].balance);

							console.log( 'debtor balance = 0' );
							console.log( 'creditor balance = ' + remaining);

						}else{

						}

						console.log( debtor[i].name + ' own ' + amount + ' aud to ' + creditor[j].name );

					}else{
						break;
					}
				}
			}


		res.status(200).json({message: 'Balance resolved'});
	})


module.exports = {
	"public" : router
};