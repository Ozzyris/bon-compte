import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class notification_service {
	private notification_subscription = new Subject<any>();

	constructor(){}

    add_notification( notification ) {
        this.notification_subscription.next(notification);
    }

    subscribe_to_notification(): Observable<any> {
        return this.notification_subscription;
    }
}
