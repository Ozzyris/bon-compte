import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
	providedIn: 'root'
})

export class auth_service {
	private base_url = environment.api_url + 'auth/';

	constructor( private http: HttpClient ){}

	// SIGN IN
	signin( user_credential ): Observable<any>{
		let url = this.base_url + 'signin';
		return this.http.post(url, user_credential, httpOptions);
	}
}
