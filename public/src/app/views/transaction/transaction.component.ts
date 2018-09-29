import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

//services
import { wallet_service } from '../../services/wallet/wallet.service';
import { validator_service } from '../../services/validator/validator.service';
import { convertor_service } from '../../services/convertor/convertor.service';
import { common_service } from '../../services/common/common.service';
import { notification_service } from '../../services/notification/notification.service';

// constants
const all_currency = ['USD', 'AUD', 'EUR', 'YEN'];

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss'],
	providers: [wallet_service, validator_service, convertor_service, common_service]
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


	constructor( private router: Router, private wallet_service: wallet_service, private validator_service: validator_service, private convertor_service: convertor_service, private common_service: common_service, private notification_service: notification_service ){}
	ngOnInit(){
		this.get_user_currency();
	}

	get_user_currency(){
		this.common_service.get_user_from_storage()
			.then( user_details => {
				this.update_currency( user_details.currency );
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
		this.common_service.get_wallet_id_from_storage()
			.then( wallet_id => {
				if( !wallet_id ){
					this.router.navigate(['wallet']);
				}else{
					this.transaction.wallet_id = wallet_id;
					this.transaction.original_amount.currency = this.currency.choosen;
					this.transaction.amount = this.convertor_service.convert_to_currency( parseInt( this.transaction.original_amount.amount ), this.get_conversion_type() );
	
					//cent conversion
					this.transaction.amount = this.transaction.amount*100;
					this.transaction.original_amount.amount = this.transaction.original_amount.amount*100;
	
					this.wallet_service.add_entry( this.transaction )
						.subscribe( is_transaction_added => {
								this.transaction.original_amount.amount = this.transaction.description = '';
								this.button_text = 'Add entry';

								let notification = {
									status: 'success',
									title: 'Transaction Added',
									description: 'Your transaction has been successfully added.',
								}
								this.notification_service.add_notification( notification );
							}, error => {
								if(error.error[0].code == 'middleware_error') this.common_service.log_out();
								this.info_note = '<span class="icon""></span> ' + error.error.message;
								this.button_text = 'Add entry';

								let notification = {
									status: 'error',
									title: 'Transaction Failed',
									description: 'Your transaction has failed. Please try again shortly.',
								}
								this.notification_service.add_notification( notification );
							});
				}
			})
	}
	dismiss_input(){
		let notification = {
			status: 'error',
			title: 'Transaction Failed',
			description: 'Your transaction has failed. Please try again shortly.',
		}
		this.notification_service.add_notification( notification );				

		// this.transaction.amount = this.transaction.description = '';
	}
}
