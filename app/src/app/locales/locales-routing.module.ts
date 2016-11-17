import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LocalesListComponent } from './locales-list/locales-list.component';
import { AuthGuard } from './../auth/auth.guard';

const localesRoutes = [
    { path: 'projects/:projectId/locales', component: LocalesListComponent, canActivate: [AuthGuard] }
]

@NgModule({
    imports: [
        RouterModule.forChild(localesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class LocalesRoutingModule { }