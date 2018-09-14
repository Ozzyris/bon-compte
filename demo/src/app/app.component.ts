import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
//services
import { common_service } from './services/common/common.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [common_service]
})

export class AppComponent {
	is_menu_display: Boolean = false;
	user_details: any = {};

	constructor( private router: Router, private common_service: common_service ){
		this.router.events.subscribe((event: Event) => {
			if(event instanceof NavigationEnd ){
				if( event.url.indexOf("dashboard") >= 0 || event.url.indexOf("transaction") >= 0 || event.url.indexOf("history") >= 0 ){
				this.is_menu_display = true;
				}else{
					this.is_menu_display = false;
				}
			}
      	});
      	this.get_user_details();
	}
	scroll_top(){
	    window.scroll(0,0);
	}

	get_user_details(){
		this.common_service.get_user_from_storage()
			.then( user_details => {
				this.user_details = user_details;
			})
	}
}
