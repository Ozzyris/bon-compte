import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'shrinkor'
})

export class ShrinkorPipe implements PipeTransform {
	transform(value: any, args?: any): any {
		return value.substring(0, 1).toUpperCase() + '.';
	}
}
