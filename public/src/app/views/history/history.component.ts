import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

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

	constructor( private wallet_service: wallet_service ){}
	ngOnInit(){
		this.get_all_transactions();
	}

	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('wallet_id') );
		})
	}

	get_all_transactions(){
		let payload = {
			wallet_id: ''
		}

		this.get_wallet_id_from_storage()
			.then( wallet_id => {
				payload.wallet_id = wallet_id;

				this.all_transactions = this.wallet_service.get_all_transactions( payload );
			})	
	}
}
