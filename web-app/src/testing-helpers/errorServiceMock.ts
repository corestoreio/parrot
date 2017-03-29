import { Injectable } from '@angular/core';

@Injectable()
export class ErrorServiceMock {
   public errors: string[] = ['Something went wrong. That\'s all we know.'];

    mapErrors(error: any, context: string) {
        return this.errors;
    }
}
