import { Pipe, PipeTransform } from '@angular/core';

//services
import { convertor_service } from '../../services/convertor/convertor.service';

@Pipe({
  name: 'convertor'
})

export class ConvertorPipe implements PipeTransform {
	constructor( private convertor_service: convertor_service ){}

	transform(value: any, currency: string): any {
		//convertion in cents
		let converted_amount = this.convertor_service.convert_to_currency( value, currency);

		//rounded the to cents
		converted_amount = Math.round( converted_amount );

		// move to real price
		converted_amount =  Math.round( converted_amount ) / 100;

		// keep the 2 digits.
		converted_amount = parseFloat( converted_amount ).toFixed(2);


		return converted_amount;
	}
}
