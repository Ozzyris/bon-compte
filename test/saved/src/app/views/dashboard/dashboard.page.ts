import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

//services
import { wallet_service } from '../../services/wallet/wallet.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
	providers: [wallet_service]
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

	constructor( private wallet_service: wallet_service ){
		console.log('elas');
	}
	ngOnInit(){
		this.get_last_5_transactions();
		this.get_dashboard_details();
		this.get_user_currency();
	}

	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('wallet_id') );
		})
	}
	get_currency_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('currency') );
		})
	}

	get_user_currency(){
		this.get_currency_from_storage()
			.then( currency => {
				this.user_currency = this.get_conversion_type( currency );
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

		this.get_wallet_id_from_storage()
			.then( wallet_id => {
				payload.wallet_id = wallet_id;

				this.wallet_service.get_dashboard_details( payload )
					.subscribe( dashboard_details => {
						this.dashboard_details.my_details = dashboard_details.user_details;
						this.dashboard_details.partner_details = dashboard_details.partner_details;
					})
			})
	}
	get_last_5_transactions(){
		let payload = {
			wallet_id: ''
		}

		this.get_wallet_id_from_storage()
			.then( wallet_id => {
				payload.wallet_id = wallet_id;

				this.last_5_transactions = this.wallet_service.get_last_5_transactions( payload );
			})	
	}
}
