import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AuthService } from './services/auth.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        HttpModule
    ],
    exports: [
        RegisterComponent,
        LoginComponent
    ],
    declarations: [
        RegisterComponent,
        LoginComponent
    ],
    providers: [AuthService]
})
export class AuthModule { }

export {
    AuthService,
    RegisterComponent,
    LoginComponent,
    AuthGuard,
    UnauthGuard
};