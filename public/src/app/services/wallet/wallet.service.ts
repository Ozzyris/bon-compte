import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class wallet_service {
	base_url = environment.api_url + 'public/';
	httpOptions: any;

	constructor( private http: HttpClient ){
    	this.get_session_from_storage()
    		.then( session => {
    			this.httpOptions = {
    				headers: new HttpHeaders({
    					'Content-Type':  'application/json',
    					'X-Auth-Token': session
    				})
    			};
    		})
	}

	get_session_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('session') );
		})
	}

	get_wallets(){
		let url = this.base_url + 'get-wallet';
		return this.http.get(url, this.httpOptions);
	}

	get_dashboard_details( payload ){
		let url = this.base_url + 'get-user-values';
		return this.http.post(url, payload, this.httpOptions);
	}

	get_last_5_transactions( payload ){
		let url = this.base_url + 'get-last-5-transactions';
		return this.http.post(url, payload, this.httpOptions);
	}

	get_all_transactions( payload ){
		let url = this.base_url + 'get-all-transactions';
		return this.http.post(url, payload, this.httpOptions);
	}
	
	add_entry( payload ){
		let url = this.base_url + 'add-transaction';
		return this.http.post(url, payload, this.httpOptions);
	}
}
