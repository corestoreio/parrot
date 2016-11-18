import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { UnauthGuard } from './auth/unauth.guard';

import { HomePageComponent } from './pages/home/home-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const appRoutes: Routes = [
    { path: 'register', component: RegisterComponent, canActivate: [UnauthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
    { path: 'projects', component: HomePageComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
];
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
