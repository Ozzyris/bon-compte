import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//services
import { auth_service } from '../../services/auth/auth.service';
import { validator_service } from '../../services/validator/validator.service';
import { common_service } from '../../services/common/common.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [auth_service, common_service]

})

export class LoginComponent implements OnInit {
	//user information
	user_information: any = {
		email: '',
		password: '',
		stay_loggedin: false
	};

	//inputs feedback
	info_email: string = '';
	info_password: string = '';

	//primary cta
	button_text: string = 'Login';

	constructor( private router: Router, private auth_service: auth_service, private validator_service: validator_service, private common_service: common_service ){
		this.check_storage();
	}
	ngOnInit(){}

	check_storage(){
		Promise.all([this.common_service.get_session_from_storage(), this.common_service.get_wallet_id_from_storage()])
			.then( values => {
				if(values[0] && values[1]){
					this.router.navigate(['dashboard']);
				}else if( values[0] ){
					this.router.navigate(['wallet']);
				}
			});
	}

	input_verification(){
		this.button_text = 'Loading';

		let open_door = true;
		this.info_email = this.info_password = '';

		if( this.validator_service.email_test( this.user_information.email ) == false ){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is incorrect';
		}
		if( this.user_information.email == ''){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is required';
		}
		if( this.user_information.password == ''){
			open_door = false;
			this.info_password = '<span class="icon""></span> Your password is required';
		}

		if( open_door == true ){
			this.signin();
		}else{
			this.button_text = 'Login';
		}
	}

	signin(){
		this.auth_service.signin( this.user_information )
			.subscribe( user_details => {
					if( user_details ){
						let user_info = {
							given_name: user_details.given_name,
							family_name: user_details.family_name,
							avatar: user_details.avatar,
							currency: user_details.currency,
							user_id: user_details.user_id
						}
						let user_stringify = JSON.stringify( user_info );
						localStorage.setItem("user", user_stringify);
						localStorage.setItem("session", user_details.session);
						this.router.navigate(['wallet']);
					}
				}, err => {
					this.info_password = '<span class="icon""></span> ' + err.error.message;
					this.button_text = 'Login';
				});
	}
}
