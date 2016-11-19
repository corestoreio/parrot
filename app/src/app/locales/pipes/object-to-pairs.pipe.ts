import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'objtopairs'
})
export class ObjectToPairsPipe implements PipeTransform {
    transform(obj: Object) {
        let result = [];
        let keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            let pair = {
                key: keys[i],
                value: obj[keys[i]]
            };
            result.push(pair);
        }
        return result;
    }
}