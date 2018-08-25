//angular
import { Injectable } from '@angular/core';

// ionic plugin
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Events } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})

export class common_service {
	constructor( public events: Events, private storage: Storage, public navCtrl: NavController ){}

	// get from storage
	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			this.storage.get('wallet_id').then((val) => {
				resolve( val );
			});
		})
	}
	get_session_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			this.storage.get('session').then((val) => {
				resolve( val );
			});
		})
	}
	get_user_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			this.storage.get('user')
				.then( user_stringify => {
					resolve( JSON.parse( user_stringify ));
				})
		})
	}

	// clear storage
	log_out(){
		this.storage.clear();
		this.navCtrl.goRoot('/login');
        this.events.publish('side_menu', 'close');
	}
    update_wallet(){
        this.storage.remove('wallet_id')
        this.navCtrl.goRoot('/wallet');
        this.events.publish('side_menu', 'close');
    }
}