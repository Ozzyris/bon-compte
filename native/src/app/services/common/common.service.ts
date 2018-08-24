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
	user_details: any = {
		first_name: '',
		last_name: '',
		avatar: '',
		currency: '',
		user_id: ''
	}

	constructor( public events: Events, private storage: Storage, public navCtrl: NavController ){
		// this.get_from_storage();
		this.received_info();
	}

	// get from storage
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
	get_user_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			this.storage.get('user_id').then((val) => {
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

	// clear storage
	log_out(){
		this.storage.clear();
		this.navCtrl.goRoot('/login');
        this.events.publish('side_menu', close);
	}
    update_wallet(){
        this.storage.remove('wallet_id')
        this.navCtrl.goRoot('/wallet');
        this.events.publish('side_menu', close);
    }

    // manage user
    received_info(){
		this.events.subscribe('user_info', ( user_info ) => {
			this.user_details.first_name = user_info.first_name;
			this.user_details.last_name = user_info.last_name;
			this.user_details.avatar = user_info.avatar;
			this.user_details.currency = user_info.currency;
			this.user_details.user_id = user_info.user_id;

			this.save_to_storage();
		})
	}
	save_to_storage(){
		let user_stringify = JSON.stringify( this.user_details );
		this.storage.set( 'user', user_stringify );

	}

	get_user(){
		return new Promise((resolve, reject)=>{
			this.storage.get('user')
				.then(( user_stringify) => {
					console.log(JSON.parse( user_stringify ));
					resolve( JSON.parse( user_stringify ));
				})
		})
	}
}