import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

//services
import { wallet_service } from '../../services/wallet/wallet.service';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.scss'],
	providers: [wallet_service]
})

export class WalletComponent implements OnInit {
	api_url: string = environment.api_url + 'uploads/';
	wallets: any;

	constructor( private router: Router, private wallet_service: wallet_service ){}
	ngOnInit(){
		this.get_wallets();
	}

	get_wallets(){
		this.wallets = this.wallet_service.get_wallets();
	}

	open_wallet( wallet_id ){
		console.log( wallet_id );
		localStorage.setItem("wallet_id", wallet_id);
		this.router.navigate(['dashboard']);
	}
}
