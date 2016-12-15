import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizedGuard } from './users/guards/authorized.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { UnauthGuard } from './auth/guards/unauth.guard';

import { HomePage, ProjectLocalesPage, LocalePage, ProjectKeysPage, ProjectTeamPage, APIAccessPage, APIAppPage, AccountPage, ErrorPage } from './pages';
import { ProjectWrapperComponent } from './projects';
import { LoginComponent, RegisterComponent } from './auth';

const appRoutes: Routes = [
    { path: 'register', component: RegisterComponent, canActivate: [UnauthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
    { path: 'error', component: ErrorPage },
    { path: 'me', component: AccountPage, canActivate: [AuthGuard] },
    { path: 'projects', component: HomePage, canActivate: [AuthGuard] },
    {
        path: 'projects/:projectId', component: ProjectWrapperComponent, canActivate: [AuthGuard], children: [
            { path: '', component: ProjectLocalesPage },
            { path: 'keys', component: ProjectKeysPage },
            { path: 'team', component: ProjectTeamPage, canActivate: [AuthorizedGuard] },
            { path: 'api', component: APIAccessPage, canActivate: [AuthorizedGuard] },
            { path: 'api/:clientId', component: APIAppPage, canActivate: [AuthorizedGuard] },
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
