import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WALLET } from '../../../assets/json/wallet';

@Injectable({
  providedIn: 'root'
})

export class wallet_service {
	wallet: any = WALLET; 

	constructor(){}

	get_wallets(){
		let array_of_wallet = [];
		array_of_wallet.push( this.wallet );
		return array_of_wallet;
	}

	get_dashboard_details(){
		let dashboard_details = {
			my_details: this.wallet.member[0] ,
			partner_details: []
		}
		dashboard_details.partner_details.push(this.wallet.member[1])
		dashboard_details.partner_details.push(this.wallet.member[2])
		return dashboard_details;
	}

	get_last_5_transactions(){
		return this.wallet.transaction.slice(0,5);
	}

	get_all_transactions(){
		return this.wallet.transaction;
	}

	add_entry( transaction ) : Promise<any>{
		return new Promise((resolve, reject)=>{
			this.wallet.transaction.push( transaction );
			resolve( true );
		})
	}	
	remove_entry( index) : Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( this.wallet.transaction.splice(index, 1) );
		})
	}
}
