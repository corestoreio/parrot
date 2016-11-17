import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project/project.component';
import { AuthGuard } from './../auth/auth.guard';

const projectsRoutes = [
    { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: 'projects/:projectId', component: ProjectComponent, canActivate: [AuthGuard] }
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