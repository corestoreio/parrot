import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        HttpModule,
        FormsModule,
        CommonModule,
        AuthRoutingModule
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
