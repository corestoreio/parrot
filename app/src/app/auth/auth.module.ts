import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { UnauthGuard } from './unauth.guard';

@NgModule({
    imports: [
        FormsModule,
        CommonModule
    ],
    declarations: [
        RegisterComponent,
        LoginComponent
    ]
})
export class AuthModule { }
