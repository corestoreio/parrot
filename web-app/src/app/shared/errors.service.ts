import { Injectable } from '@angular/core';

import { ErrorMap } from './../app.constants';

export interface APIError {
    errors?: Array<APIError>;
    type: string;
    message: string;
}

@Injectable()
export class ErrorsService {

    private errorMap;
    private defaultError: string[] = ['Something went wrong. That\'s all we know.'];
    constructor() {
        this.errorMap = ErrorMap;
    }

    mapErrors(error: APIError, context: string): string[] {
        let sub = this.errorMap[context];
        if (!sub) {
            return this.defaultError;
        }

        console.log(error);

        if (error.errors) {
            let result = error.errors.map(err => {
                let current = sub[err.type];
                return !current ? this.defaultError : current;
            })
            return result;
        }

        let current = sub[error.type];
        return !current ? this.defaultError : [current];
    }
}
