import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

//services
import { wallet_service } from '../../services/wallet/wallet.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	providers: [wallet_service]
})

export class DashboardComponent implements OnInit {
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

	constructor( private wallet_service: wallet_service ){}
	ngOnInit(){
		this.get_last_5_transactions();
		this.get_dashboard_details();
	}

	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('wallet_id') );
		})
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
