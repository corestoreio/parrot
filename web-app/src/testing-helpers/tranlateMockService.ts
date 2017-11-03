import { Observable } from 'rxjs/Observable';

export class TranslateServiceStub {

	setDefaultLang(key: any): any {
		return Observable.of(key);
	}

	getBrowserCultureLang(key: any): any {
		return Observable.of(key);
	}

	use(key: any): any {
		return Observable.of(key);
	}
}
