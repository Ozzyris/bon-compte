import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpHeaders, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { switchMap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable()

export class interceptor_service implements HttpInterceptor {
	httpOptions: any;

	constructor(private storage: Storage, public navCtrl: NavController ){}

	get_session_from_storage(){
		return this.storage.get('session').then((val) => {
			return val ;
		});
	}
	intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>{
		return from(this.get_session_from_storage())
			.pipe(switchMap(session => {
 				const headers = req.headers
					.set('X-Auth-Token', session)
					.append('Content-Type', 'application/json');
 				const reqClone = req.clone({
					headers 
				});
				return next.handle(reqClone);
			}));
	}
}