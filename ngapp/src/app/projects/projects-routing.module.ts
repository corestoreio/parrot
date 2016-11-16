import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project/project.component';
import { AuthGuard } from './../auth.guard';

const projectsRoutes = [
    { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: 'projects/:id', component: ProjectComponent }
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