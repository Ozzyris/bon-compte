import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// import { NativeStorage } from '@ionic-native/native-storage';

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
	// private nativeStorage: NativeStorage,
	constructor(  public navCtrl: NavController, private validator_service: validator_service, private auth_service: auth_service ){}
	ngOnInit(){}

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
		// this.navCtrl.goRoot('/wallet');
		// this.navCtrl.goForward('/wallet');
		// this.router.navigateByUrl('wallet');

		this.auth_service.signin( this.user_information )
			.subscribe( user_details => {
					if( user_details ){
						// this.nativeStorage.setItem('session', user_details.session);
						// this.nativeStorage.setItem('currency', user_details.currency);
						localStorage.setItem("session", user_details.session);
						localStorage.setItem("currency", user_details.currency);
						this.navCtrl.goRoot('/wallet');
					}
				}, err => {
					this.info_password = '<span class="icon""></span> ' + err.error.message;
					this.button_text = 'Login';
				});
	}
}
