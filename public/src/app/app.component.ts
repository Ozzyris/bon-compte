import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	is_menu_display: Boolean = false;

	constructor( private router: Router ){
		this.router.events.subscribe( data => {
			console.log( data );
        	if( data.url != undefined && data.url != '/' && data.url.indexOf("login") <= 0 && data.url.indexOf("wallet") ){
        		this.is_menu_display = true;
        	}else{
        		this.is_menu_display = false;
        	}
      	});
	}
	scroll_top(){
	    window.scroll(0,0);
	}
}
