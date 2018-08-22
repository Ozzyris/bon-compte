import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//services
import { auth_service } from '../../services/auth/auth.service';
import { validator_service } from '../../services/validator/validator.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [auth_service, validator_service]

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

	constructor( private router: Router, private auth_service: auth_service, private validator_service: validator_service ){
		this.check_storage();
	}
	ngOnInit(){}

	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('wallet_id') );
		})
	}
	get_session_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('session') );
		})
	}

	check_storage(){
		Promise.all([this.get_session_from_storage(), this.get_wallet_id_from_storage()])
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
						localStorage.setItem("session", user_details.session);
						localStorage.setItem("currency", user_details.currency);
						localStorage.setItem("user_id", user_details.user_id);
						this.router.navigate(['wallet']);
					}
				}, err => {
					this.info_password = '<span class="icon""></span> ' + err.error.message;
					this.button_text = 'Login';
				});
	}
}
