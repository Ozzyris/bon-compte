import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})

export class common_service {
	constructor( private router: Router ){}

	// get from storage
	get_wallet_id_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('wallet_id') );
		})
	}
	get_session_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('session') );
		})
	}
	get_user_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( JSON.parse(localStorage.getItem('user')) );
		})
	}
	// clear storage
	log_out(){
		localStorage.clear();
		this.router.navigate(['login']);
	}
    update_wallet(){
        localStorage.removeItem( 'wallet_id' );
        this.router.navigate(['wallet']);
    }
}
