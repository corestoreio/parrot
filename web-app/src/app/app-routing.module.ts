import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanActivateAPI } from './users/guards/can-activate-api.guard';
import { CanActivateTeam } from './users/guards/can-activate-team.guard';
import { CanActivateProject } from './users/guards/can-activate-project.guard';
import { CanActivateLocale } from './users/guards/can-activate-locale.guard';
import { CanActivateProjectSettings } from './users/guards/can-activate-project-settings.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { UnauthGuard } from './auth/guards/unauth.guard';

import {
    HomePage, ProjectLocalesPage, LocalePage, ProjectKeysPage, ProjectTeamPage,
    APIAccessPage, APIAppPage, AccountPage, ErrorPage, ProjectSettingsPage
} from './pages';

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
            { path: '', component: ProjectLocalesPage, canActivate: [CanActivateProject] },
            { path: 'settings', component: ProjectSettingsPage, canActivate: [CanActivateProjectSettings] },
            { path: 'keys', component: ProjectKeysPage, canActivate: [CanActivateProject] },
            { path: 'team', component: ProjectTeamPage, canActivate: [CanActivateTeam] },
            { path: 'api', component: APIAccessPage, canActivate: [CanActivateAPI] },
            { path: 'api/:clientId', component: APIAppPage, canActivate: [CanActivateAPI] },
            { path: 'locales', redirectTo: '', pathMatch: 'full' },
            { path: 'locales/:localeIdent', component: LocalePage, canActivate: [CanActivateLocale] },
        ]
    },
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
];
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: [
        CanActivateAPI,
        CanActivateTeam,
        CanActivateProject,
        CanActivateLocale,
        CanActivateProjectSettings,
    ]
})
export class AppRoutingModule { }
