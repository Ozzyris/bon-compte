import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NavController } from '@ionic/angular';

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

	constructor( public navCtrl: NavController, private wallet_service: wallet_service ){}
	ngOnInit(){
		this.get_wallets();
	}

	get_wallets(){
		this.wallets = this.wallet_service.get_wallets();
	}

	open_wallet( wallet_id ){
		localStorage.setItem("wallet_id", wallet_id);
		this.navCtrl.goRoot('/tabs');
	}
}
