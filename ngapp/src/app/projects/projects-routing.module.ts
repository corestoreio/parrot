import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { AuthGuard } from './../auth/auth.guard';

const projectsRoutes = [
    { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: 'projects/:projectId', component: ProjectDetailComponent, canActivate: [AuthGuard] }
]

@NgModule({
    imports: [
        RouterModule.forChild(projectsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProjectsRoutingModule { }