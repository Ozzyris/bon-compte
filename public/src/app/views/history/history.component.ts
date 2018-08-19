import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

//services
import { wallet_service } from '../../services/wallet/wallet.service';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],
	providers: [wallet_service]
})

export class HistoryComponent implements OnInit {
	api_url: string = environment.api_url + 'uploads/';
	all_transactions: any;
	user_currency: string;
	money_sign: string;
	selected_item: string;

	constructor( private router: Router, private wallet_service: wallet_service ){}
	ngOnInit(){
		this.get_all_transactions();
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
	
	get_user_currency(){
		this.get_currency_from_storage()
			.then( currency => {
				this.user_currency = this.get_conversion_type( currency );
			})
	}

	get_all_transactions(){
		let payload = {
			wallet_id: ''
		}

		this.get_wallet_id_from_storage()
			.then( wallet_id => {
				payload.wallet_id = wallet_id;
				
				if( !wallet_id ){
					this.router.navigate(['wallet']);
				}else{
					this.wallet_service.get_all_transactions( payload )
						.subscribe( all_transactions => {
								this.all_transactions = all_transactions
							}, error => {
								console.log(error.error);
								if(error.error[0].code == 'middleware_error') this.loggedout();
							});
				}
			})	
	}

	loggedout(){
		localStorage.removeItem('session');
		localStorage.removeItem('wallet_id');
		this.router.navigate(['login']);
	}

	activate_item( index ){
		if( index == this.selected_item ){
			this.selected_item = 'x';
		}else{
			this.selected_item = index;
		}		
	}
}
