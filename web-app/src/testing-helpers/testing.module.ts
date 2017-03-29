import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NgForm, FormsModule } from '@angular/forms';

import { AuthService } from './../app/auth/';
import { ErrorsService } from './../app/shared/errors.service';
import { AuthSericeMock, ErrorServiceMock } from './index';


@NgModule({
    imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule
    ],

    declarations: [],
    providers: [
        NgForm,
        { provide: AuthService, useClass: AuthSericeMock },
        { provide: ErrorsService, useClass: ErrorServiceMock },
    ],
    exports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
    ]
})

export class TestModule {
}
