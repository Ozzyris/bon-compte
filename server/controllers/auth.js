const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  users = require('../models/user').user;

// HELPERS
const bcrypt = require('../helpers/bcrypt'),
	  token_manager = require('../helpers/token_manager');

// MIDDLEWARE
var check_auth = require('../middlewares/auth').check_auth;
router.use( check_auth );
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

module.exports = {
	"auth" : router
};