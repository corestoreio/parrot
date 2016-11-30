import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/guards/auth.guard';
import { UnauthGuard } from './auth/guards/unauth.guard';

import { HomePage, ProjectPage, LocalePage, ProjectKeysPage, ProjectWrapper } from './pages';
import { LoginComponent, RegisterComponent } from './auth';

const appRoutes: Routes = [
    { path: 'register', component: RegisterComponent, canActivate: [UnauthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
    { path: 'projects', component: HomePage, canActivate: [AuthGuard] },
    {
        path: 'projects/:projectId', component: ProjectWrapper, canActivate: [AuthGuard], children: [
            { path: '', component: ProjectPage },
            { path: 'keys', component: ProjectKeysPage },
            { path: 'locales', redirectTo: '', pathMatch: 'full' },
            { path: 'locales/:localeIdent', component: LocalePage },
        ]
    },
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
];
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
