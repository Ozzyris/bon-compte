const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  moment = require('moment'),
	  user_model = require('../models/user').user;

// HELPERS
const bcrypt = require('../helpers/bcrypt'),
	  token_manager = require('../helpers/token_manager');

// MIDDLEWARE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	// SIGN UP
	router.put('/signup', function (req, res) {
		let user = {
			email: req.body.email,
			given_name: req.body.given_name,
			family_name: req.body.family_name,
			password: req.body.password,
			avatar: req.body.avatar
		};

		if( req.body.code == 'KDP3-YQE8-FW6D-LG2H'){
			user_model.check_email( user.email )
				.then( is_email_unique => {
					return bcrypt.hash_password( user.password );
				})
				.then( hash_password => {
					user.password = hash_password;
					new user_model(user).save();
				})
				.then( is_user_created => {
					res.status(200).json({message: 'New user added to the database', code: 'user_created'});
				})
				.catch( error => {
					res.status(401).json( error );
				})
		}else{
			res.status(401).json( {message: 'Your signup code is invalid', code: 'signup_code_invalid'} );
		}
	});

	// SIGN IN
	router.post('/signin', function (req, res) {
		let user = {
			id: '',
			email: req.body.email,
			password: req.body.password,
			currency: '',
		},
		session = {
			token: '',
			expiration_date: '',
			keep_session: req.body.keep_session
		};

		user_model.get_password_from_email( user.email )
			.then( db_password => {
				return bcrypt.compare_password( user.password, db_password );
			})
			.then(are_password_similar => {
				if( are_password_similar ){
					return user_model.get_id_from_email( user.email );
				}else{
					throw {message: 'Your email or password is invalid', code: 'wrong_identifiants'};
				}
			})
			.then(user_id => {
				user.id = user_id;
				session.token = token_manager.create_token();

				if( session.keep_session == true ){
					session.expiration_date = moment().add(7,'day');
				}else{
					session.expiration_date = moment().add(1,'day');
				}

				return user_model.save_session_from_id( session, user_id );
			})
			.then(is_session_saved => {
				return user_model.get_userdetail_from_id( user.id );
			})
			.then(user_details => {
				user.currency = user_details.currency;
				res.status(200).json({ user_id: user.id, session: session.token, currency: user.currency });
			})
			.catch( error => {
				res.status(401).json( error );
			});
	});

module.exports = {
	"auth" : router
};