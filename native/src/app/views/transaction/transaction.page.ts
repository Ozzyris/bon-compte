import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';


//services
import { wallet_service } from '../../services/wallet/wallet.service';
import { validator_service } from '../../services/validator/validator.service';
import { convertor_service } from '../../services/convertor/convertor.service';

// constants
const all_currency = ['USD', 'AUD', 'EUR', 'YEN'];

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.page.html',
	styleUrls: ['./transaction.page.scss'],
	providers: [wallet_service, validator_service, convertor_service]
})
export class TransactionPage implements OnInit {
	//transaction information
	transaction : any = {
		amount: '',
		description: '',
		original_amount: {
			amount: '',
			currency: ''
		}
	}
	currency : any = {
		choosen: '',
		other: []
	}

	//inputs feedback
	info_amount = '';
	info_note = '';
	is_currency_displayed: boolean = false;

	button_text: String = 'Add entry';

	constructor( public navCtrl: NavController, private storage: Storage, private wallet_service: wallet_service, private validator_service: validator_service, private convertor_service: convertor_service ){}
	ngOnInit(){
		this.get_user_currency();
	}

	get_user_currency(){
		this.get_currency_from_storage()
			.then( currency => {
				this.update_currency( currency );
			})
	}
	get_currency_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			this.storage.get('currency').then((val) => {
				resolve( val );
			});
		})
	}
	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			this.storage.get('wallet_id').then((val) => {
				resolve( val );
			});
		})
	}
	update_currency( currency ){
		this.currency.choosen = currency;
		this.currency.other = all_currency.slice(0);

		let index = this.currency.other.indexOf( currency );
		if (index > -1) {
			this.currency.other.splice(index, 1);
		}
		this.is_currency_displayed = false;
	}

	input_verification(){
		this.button_text = 'Loading';

		let open_door = true;
		this.info_amount = this.info_note = '';

		if( this.transaction.original_amount.amount == ''){
			open_door = false;
			this.info_amount = '<span class="icon""></span> The transaction amount is required';
		}

		if( this.validator_service.number_test( this.transaction.original_amount.amount ) == false ){
			open_door = false;
			this.info_amount = '<span class="icon""></span> The amound need to be a number';
		}
		if( this.transaction.description == ''){
			open_door = false;
			this.info_note = '<span class="icon""></span> The transaction note required';
		}

		if( open_door == true ){
			this.add_transaction();
		}else{
			this.button_text = 'Add entry';
		}
	}

	get_conversion_type(){
		switch( this.currency.choosen ){
			case 'EUR':
				return 'eurTousd';
			case 'AUD':
				return 'audTousd';
			case 'YEN':
				return 'yenTousd';
			default:
				return '';
		}
	}

	add_transaction(){
		this.get_wallet_id_from_storage()
			.then( wallet_id => {
				if( !wallet_id ){
					this.navCtrl.goRoot('/wallet');
				}else{
					this.transaction.wallet_id = wallet_id;
					this.transaction.original_amount.currency = this.currency.choosen;
					this.transaction.amount = this.convertor_service.convert_to_currency( parseInt( this.transaction.original_amount.amount ), this.get_conversion_type() );
	
					//cent conversion
					this.transaction.amount = this.transaction.amount*100;
					this.transaction.original_amount.amount = this.transaction.original_amount.amount*100;
	
					this.wallet_service.add_entry( this.transaction )
						.subscribe( is_transaction_added => {
								alert( is_transaction_added.message )
								this.transaction.original_amount.amount = this.transaction.description = '';
								this.button_text = 'Add entry';
							}, error => {
								if(error.error[0].code == 'middleware_error') this.loggedout();
								this.info_note = '<span class="icon""></span> ' + error.error.message;
								this.button_text = 'Add entry';
							});
				}
			})
	}
	dismiss_input(){
		this.transaction.amount = this.transaction.description = '';
	}
	loggedout(){
		this.storage.remove('session')
		this.storage.remove('wallet_id')
		this.navCtrl.goRoot('/login');
	}
}
