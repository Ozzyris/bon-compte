import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	is_menu_display: Boolean = false;

	constructor( private router: Router ){
		this.router.events.subscribe((event: Event) => {
			if(event instanceof NavigationEnd ){
				if( event.url.indexOf("dashboard") >= 0 || event.url.indexOf("transaction") >= 0 || event.url.indexOf("history") >= 0 ){
				this.is_menu_display = true;
				}else{
					this.is_menu_display = false;
				}
			}
      	});
	}
	scroll_top(){
	    window.scroll(0,0);
	}
}
