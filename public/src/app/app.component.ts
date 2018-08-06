import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	constructor(){}
	scroll_top() {
	    window.scroll(0,0);
	}
}
