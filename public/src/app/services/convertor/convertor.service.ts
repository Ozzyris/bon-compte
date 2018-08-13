import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class convertor_service {
	usdXeur = 0.877573;
	usdXaud = 1.37230;
	usdXyen = 110.268;

	constructor(){}

	get_rate( type ){
		switch( type ){
			case 'usdToeur':
				return this.usdXeur;
			case 'usdToaud':
				return this.usdXaud;
			case 'usdToyen':
				return this.usdXyen;
			case 'eurTousd':
				return 1 / this.usdXeur;
			case 'audTousd':
				return 1 / this.usdXaud;
			case 'yenTousd':
				return 1 / this.usdXyen;
			default:
				return 1;
		}
	}

	currency_converter( amount, type ){
		let rate = this.get_rate(type);
		return Math.round((amount * rate) * 100) / 100;
	}
}
