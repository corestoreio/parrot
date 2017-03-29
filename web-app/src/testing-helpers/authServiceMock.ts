import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';



@Injectable()
export class AuthSericeMock {
    public result: boolean = true;
    public userModel = {
        email: 'test@testdomain.com', 
        password: 'testpass'
    }
    constructor(  ){

    }
    login( user: any ){
        if ( user.email === this.userModel.email ) {
            return Observable.of( this.result );
        }else{
            return Observable.throw( new Error('no payload in response') );
        }
    }

    register(user: any): Observable<boolean> {
        if ( user.email === this.userModel.email ) {
            return Observable.of( true );
        }else{
            return Observable.throw( new Error('no meta in response') );
        }
    }
}
