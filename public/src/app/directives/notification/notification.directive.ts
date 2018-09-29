import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

//services
import { notification_service } from '../../services/notification/notification.service';

@Component({
	selector: 'notification',
	templateUrl: './notification.directive.html',
	styleUrls: ['./notification.directive.scss']
})

export class notification_directive implements OnInit, OnDestroy{
	notification_subscription: Subscription;

	notifications: any = [];
	status: any = {
		'error': {
			color: 'rgb(225, 89, 68)',
			symbole: ''
		},
		'warning': {
			color: '',
			symbole: ''
		},
		'info': {
			color: 'rgb(95, 170, 239)',
			symbole: ''
		},
		'success': {
			color: '#3FB39D',
			symbole: ''
		}
	};
	active_status: any;

	constructor( private notification_service: notification_service ){}
	ngOnInit(){
		this.notification_subscription = this.notification_service.subscribe_to_notification().subscribe(
			notification => {
				this.add_notification( notification );				
			});
	}
	ngOnDestroy(){
		this.notification_subscription.unsubscribe();
	}

	add_notification( notification_test ){
		let status = notification_test.status;
		let notification = {
			id: 'notification_' + this.notifications.length,
			status: notification_test.status,
			symbole: this.status[ notification_test.status ].symbole,
			title: notification_test.title,
			description: notification_test.description,
		};
		this.notifications.push( notification );

		let timer = setTimeout(() => {  
			this.remove_notification( notification.id )
			clearTimeout(timer);
		}, 7000);
	}
	status_selector( status ){
		this.active_status
	}

	remove_notification( id ){
		let index;
		for (var i = this.notifications.length - 1; i >= 0; i--) {

			if( this.notifications[i].id == id ){
				index = i;
			}
		}
		if (index > -1) {
			this.notifications.splice(index, 1);
		}
	}
}
