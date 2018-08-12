import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

//services
import { wallet_service } from '../../services/wallet/wallet.service';


@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss'],
	providers: [wallet_service]
})

export class TransactionComponent implements OnInit {
	//transaction information
	transaction : any = {
		amount: '',
		description: ''
	}

	//inputs feedback
	info_amount = '';
	info_note = '';

	button_text: String = 'Add entry';


	constructor( private wallet_service: wallet_service ){}
	ngOnInit(){}

	input_verification(){
		this.button_text = 'Loading';

		let open_door = true;
		this.info_amount = this.info_note = '';

		if( this.transaction.amount == ''){
			open_door = false;
			this.info_amount = '<span class="icon""></span> The transaction amount is required';
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

	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('wallet_id') );
		})
	}

	add_transaction(){
		this.get_wallet_id_from_storage()
			.then( wallet_id => {
				this.transaction.wallet_id = wallet_id;

				this.wallet_service.add_entry( this.transaction )
					.subscribe( is_transaction_added => {
						console.log(is_transaction_added);
							alert( is_transaction_added.message )
							this.transaction.amount = this.transaction.description = '';
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
