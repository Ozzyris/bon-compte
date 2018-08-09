var uuid = require('uuid/v4'),
	Promise = require('bluebird'),
	moment = require('moment');

function create_token(){
	return uuid();
}

function check_if_token_is_valid( token_details ){
	return new Promise((resolve, reject)=>{
		resolve( moment.unix(token_details.expiration_date/1000).isAfter() );
	})
}

module.exports={
    'create_token': create_token,
    'check_if_token_is_valid': check_if_token_is_valid,
}