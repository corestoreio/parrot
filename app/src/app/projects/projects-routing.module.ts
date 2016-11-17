import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { AuthGuard } from './../auth/auth.guard';

const projectsRoutes = [
    { path: 'projects', component: ProjectsListComponent, canActivate: [AuthGuard] },
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