//angular
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

// ionic plugin
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Events } from '@ionic/angular';

//services
import { wallet_service } from '../../services/wallet/wallet.service';
import { common_service } from '../../services/common/common.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
	providers: [wallet_service, common_service]
})

export class DashboardPage implements OnInit {
	api_url: string = environment.api_url + 'uploads/';
	dashboard_details: any = {
		my_details: {
			avatar: '',
			balance: '',
			family_name: '',
			given_name: '',
			spending: ''
		},
		partner_details: []
	};
	last_5_transactions: any;
	user_currency: string;
	money_sign: string;

	constructor( public events: Events, public navCtrl: NavController, private storage: Storage, private wallet_service: wallet_service, private common_service: common_service ){}
	ngOnInit(){
		this.get_last_5_transactions();
		this.get_dashboard_details();
		this.get_user_currency();
	}

	get_user_currency(){
		this.common_service.get_user_from_storage()
			.then( user_details => {
				this.user_currency = this.get_conversion_type( user_details.currency );
			})
	}
	get_conversion_type( currency ){
		switch( currency ){
			case 'EUR':
				this.money_sign = '€';
				return 'usdToeur';
			case 'AUD':
				this.money_sign = '$';
				return 'usdToaud';
			case 'YEN':
				this.money_sign = '¥';
				return 'usdToyen';
			default:
				return '';
		}
	}
	get_dashboard_details(){
		let payload = {
			wallet_id: ''
		}

		this.common_service.get_wallet_id_from_storage()
			.then( wallet_id => {
				payload.wallet_id = wallet_id;

				if( !wallet_id ){
					this.navCtrl.goRoot('/wallet');
				}else{
					this.wallet_service.get_dashboard_details( payload )
						.subscribe( dashboard_details => {
							this.dashboard_details.my_details = dashboard_details.user_details;
							this.dashboard_details.partner_details = dashboard_details.partner_details;
						}, error => {
							console.log(error);
							if(error.error[0].code == 'middleware_error') this.common_service.log_out();
						})
				}
			})
	}
	get_last_5_transactions(){
		let payload = {
			wallet_id: ''
		}

		this.common_service.get_wallet_id_from_storage()
			.then( wallet_id => {
				payload.wallet_id = wallet_id;

				this.last_5_transactions = this.wallet_service.get_last_5_transactions( payload );
			})	
	}
	toggle_side_menu(){
		this.events.publish('side_menu', 'toggle');
	}
}
