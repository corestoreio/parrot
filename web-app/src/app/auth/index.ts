import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        HttpModule,
        TranslateModule,
    ],
    exports: [
        RegisterComponent,
        LoginComponent,
    ],
    declarations: [
        RegisterComponent,
        LoginComponent
    ],
    providers: [AuthService, TokenService]
})
export class AuthModule { }

export {
    AuthService,
    TokenService,
    RegisterComponent,
    LoginComponent,
    AuthGuard,
    UnauthGuard
};
