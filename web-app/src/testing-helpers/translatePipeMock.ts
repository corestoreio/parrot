import {PipeTransform, Pipe, Injectable} from '@angular/core';


@Injectable()
@Pipe({
    name: 'translate',
    pure: false // required to update the value when the promise is resolved
})
export class TranslatePipeMock implements PipeTransform {
	public name: string = "translate";

	public transform(query: string, ...args: any[]): any {
		return query;
	}
}
