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
	selector: 'app-history',
	templateUrl: './history.page.html',
	styleUrls: ['./history.page.scss'],
	providers: [common_service]
})

export class HistoryPage implements OnInit {
	api_url: string = environment.api_url + 'uploads/';
	all_transactions: any;
	user_currency: string;
	user_id: string;
	money_sign: string;
	selected_item: string;

	constructor( public events: Events, public navCtrl: NavController, private storage: Storage, private wallet_service: wallet_service, private common_service: common_service ){}
	ngOnInit(){
		this.get_user_id();
		this.get_all_transactions();
		this.get_user_currency();
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
	get_user_id(){
		this.common_service.get_user_id_from_storage()
			.then( user_id => {
				this.user_id = user_id;
			})
	}
	get_user_currency(){
		this.common_service.get_currency_from_storage()
			.then( currency => {
				this.user_currency = this.get_conversion_type( currency );
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
					this.navCtrl.goRoot('/wallet');
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
	toggle_side_menu(){
		this.events.publish('side_menu');
	}
}
