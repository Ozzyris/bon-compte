import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

//services
import { auth_service } from '../../services/auth/auth.service';
import { validator_service } from '../../services/validator/validator.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	providers: [auth_service, validator_service]

})

export class LoginPage implements OnInit {
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
	constructor( private storage: Storage, public navCtrl: NavController, private validator_service: validator_service, private auth_service: auth_service ){
		this.check_storage();
	}
	ngOnInit(){}

	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			this.storage.get('wallet_id').then((val) => {
				resolve( val );
			});
		})
	}
	get_session_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			this.storage.get('session').then((val) => {
				resolve( val );
			});
		})
	}
	check_storage(){
		Promise.all([this.get_session_from_storage(), this.get_wallet_id_from_storage()])
			.then( values => {
				if(values[0] && values[1]){
					this.navCtrl.goRoot('/dashboard');
				}else if( values[0] ){
					this.navCtrl.goRoot('/wallet');
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
		console.log(this.user_information);
		this.auth_service.signin( this.user_information )
			.subscribe( user_details => {
				console.log('alex' + user_details);
					if( user_details ){
						this.storage.set('session', user_details.session);
						this.storage.set('currency', user_details.currency);
						this.navCtrl.goRoot('/wallet');
					}else{
						this.info_password = '<span class="icon""></span> An unexpeted error happen';
					}
				}, err => {
					// console.log(err);
					// this.info_password = '<span class="icon""></span> ' + err.error.message;
					this.button_text = 'Login';
				});
	}
}
