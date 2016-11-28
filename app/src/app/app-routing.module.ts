import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/guards/auth.guard';
import { UnauthGuard } from './auth/guards/unauth.guard';

import { HomePage, ProjectPage, LocalePage, ProjectKeysPage } from './pages';
import { LoginComponent, RegisterComponent } from './auth';

import { ProjectResolver, LocalesResolver } from './resolvers';

const appRoutes: Routes = [
    { path: 'register', component: RegisterComponent, canActivate: [UnauthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
    { path: 'projects', component: HomePage, canActivate: [AuthGuard] },
    { path: 'projects/:projectId', component: ProjectPage, canActivate: [AuthGuard], resolve: { project: ProjectResolver, locales: LocalesResolver } },
    { path: 'projects/:projectId/keys', component: ProjectKeysPage, canActivate: [AuthGuard] },
    { path: 'projects/:projectId/locales/:localeIdent', component: LocalePage, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
];
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: [ProjectResolver, LocalesResolver]
})
export class AppRoutingModule { }
