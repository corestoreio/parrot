import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LocalesComponent } from './locales.component';
import { AuthGuard } from './../auth/auth.guard';

const localesRoutes = [
    { path: 'projects/:projectId/locales', component: LocalesComponent, canActivate: [AuthGuard] }
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