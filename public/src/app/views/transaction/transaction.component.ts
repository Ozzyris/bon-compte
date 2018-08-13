import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

//services
import { wallet_service } from '../../services/wallet/wallet.service';
import { validator_service } from '../../services/validator/validator.service';
import { convertor_service } from '../../services/convertor/convertor.service';

// constants
const all_currency = ['USD', 'AUD', 'EUR', 'YEN'];

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss'],
	providers: [wallet_service, validator_service, convertor_service]
})

export class TransactionComponent implements OnInit {
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


	constructor( private wallet_service: wallet_service, private validator_service: validator_service, private convertor_service: convertor_service ){}
	ngOnInit(){
		// console.log( this.convertor_service.currency_converter( 100, 'eurTousd' ) );
		this.get_user_currency();
	}

	get_currency_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('currency') );
		})
	}
	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('wallet_id') );
		})
	}

	get_user_currency(){
		this.get_currency_from_storage()
			.then( currency => {
				this.update_currency( currency );
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
				this.transaction.wallet_id = wallet_id;
				this.transaction.original_amount.currency = this.currency.choosen;
				this.transaction.amount = this.convertor_service.convert_to_currency( parseInt( this.transaction.original_amount.amount ), this.get_conversion_type() );

				//cent conversion
				this.transaction.amount = this.transaction.amount*100;
				this.transaction.original_amount.amount = this.transaction.original_amount.amount*100;

				this.wallet_service.add_entry( this.transaction )
					.subscribe( is_transaction_added => {
							console.log(is_transaction_added);
							alert( is_transaction_added.message )
							this.transaction.original_amount.amount = this.transaction.description = '';
						}, err => {
							this.info_note = '<span class="icon""></span> ' + err.error.message;
							this.button_text = 'Add entry';
						});
			})
	}

	dismiss_input(){
		this.transaction.amount = this.transaction.description = '';
	}
}
