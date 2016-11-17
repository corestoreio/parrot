import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule
    ],
    declarations: [
        RegisterComponent,
        LoginComponent
    ],
    providers: [
        AuthService
    ]
})
export class AuthModule { }
