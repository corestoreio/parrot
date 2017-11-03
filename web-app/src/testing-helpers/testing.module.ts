import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NgForm, FormsModule } from '@angular/forms';

import { AuthService } from './../app/auth/';
import { ErrorsService } from './../app/shared/errors.service';
import { ProjectsService } from './../app/projects';
import { TranslateService } from '@ngx-translate/core';
import { AuthSericeMock, ErrorServiceMock, ProjectServiceMock,
    TranslateServiceStub, TranslatePipeMock } from './index';


@NgModule({
    imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule
    ],

    declarations: [
        TranslatePipeMock
    ],
    providers: [
        NgForm,
        { provide: AuthService, useClass: AuthSericeMock },
        { provide: ErrorsService, useClass: ErrorServiceMock },
        { provide: ProjectsService, useClass: ProjectServiceMock },
        { provide: TranslateService, useClass: TranslateServiceStub }
    ],
    exports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        TranslatePipeMock
    ]
})

export class TestModule {
}
