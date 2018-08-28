import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

//services
import { wallet_service } from '../../services/wallet/wallet.service';
import { common_service } from '../../services/common/common.service';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],
	providers: [wallet_service, common_service]
})

export class HistoryComponent implements OnInit {
	api_url: string = environment.api_url + 'uploads/';
	all_transactions: any;
	user_currency: string;
	user_id: string;
	money_sign: string;
	selected_item: string;

	constructor( private router: Router, private wallet_service: wallet_service, private common_service: common_service ){}
	ngOnInit(){
		this.get_all_transactions();
		this.get_user_details();
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
	
	get_user_details(){
		this.common_service.get_user_from_storage()
			.then( user_details => {
				this.user_id = user_details.user_id;
				this.user_currency = this.get_conversion_type( user_details.currency );
			})
	}

	get_all_transactions(){
		let payload = {
			wallet_id: ''
		}

		this.common_service.get_wallet_id_from_storage()
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
								if(error.error[0].code == 'middleware_error') this.common_service.log_out();
							});
				}
			})	
	}

	activate_item( index ){
		if( index == this.selected_item ){
			this.selected_item = 'x';
		}else{
			this.selected_item = index;
		}		
	}
	remove_entry( transaction_id ){
		this.common_service.get_wallet_id_from_storage()
			.then( wallet_id => {
				let payload = {
					wallet_id: wallet_id,
					transaction_id: transaction_id
				}

				this.wallet_service.remove_entry( payload )
						.subscribe( is_entry_removed => {
								console.log(is_entry_removed);
								alert( is_entry_removed.message );
								this.get_all_transactions();
							}, error => {
								console.log(error.error);
								if(error.error[0].code == 'middleware_error') this.common_service.log_out();
							});

			})
		
	}
}
