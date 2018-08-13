import { Pipe, PipeTransform } from '@angular/core';

//services
import { convertor_service } from '../../services/convertor/convertor.service';

@Pipe({
  name: 'convertor'
})

export class ConvertorPipe implements PipeTransform {
	constructor( private convertor_service: convertor_service ){}

	transform(value: any, currency: string): any {
		return Math.round( ( this.convertor_service.convert_to_currency( value, currency) / 100) * 100) / 100;
	}
}
