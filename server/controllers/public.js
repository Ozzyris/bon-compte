const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  users = require('../models/user').user;

// HELPERS

// MIDDLEWARE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

module.exports = {
	"public" : router
};