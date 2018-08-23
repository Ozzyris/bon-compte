import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

//services
import { wallet_service } from '../../services/wallet/wallet.service';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.page.html',
	styleUrls: ['./wallet.page.scss'],
	providers: [wallet_service]
})

export class WalletPage implements OnInit {
	api_url: string = environment.api_url + 'uploads/';
	wallets: any;

	constructor( private storage: Storage, public navCtrl: NavController, private wallet_service: wallet_service ){}
	ngOnInit(){
		this.get_wallets();
	}

	get_wallets(){
		this.wallet_service.get_wallets()
			.subscribe( wallet_details => {
				this.wallets = wallet_details;
			}, error => {
				console.log(error);
				if(error.error[0].code == 'middleware_error') this.loggedout();
			})
	}

	open_wallet( wallet_id ){
		this.storage.set('wallet_id', wallet_id);
		this.navCtrl.goRoot('/dashboard');
	}
	loggedout(){
		this.storage.remove('session')
		this.storage.remove('wallet_id')
		this.navCtrl.goRoot('/login');
	}
}
