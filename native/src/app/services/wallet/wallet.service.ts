import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class wallet_service {
	base_url = environment.api_url + 'public/';

	constructor( private http: HttpClient ){}

	get_wallets(){
		let url = this.base_url + 'get-wallet';
		return this.http.get(url);
	}

	get_dashboard_details( payload ): Observable<any>{
		let url = this.base_url + 'get-user-values';
		return this.http.post(url, payload);
	}

	get_last_5_transactions( payload ){
		let url = this.base_url + 'get-last-5-transactions';
		return this.http.post(url, payload);
	}

	get_all_transactions( payload ){
		let url = this.base_url + 'get-all-transactions';
		return this.http.post(url, payload);
	}
	
	add_entry( payload ): Observable<any>{
		let url = this.base_url + 'add-transaction';
		return this.http.post(url, payload);
	}
}
