import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsService } from './projects.service';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { CreateProjectComponent } from './create-project/create-project.component';

@NgModule({
    imports: [
        ProjectsRoutingModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        ProjectsListComponent,
        ProjectDetailComponent,
        CreateProjectComponent
    ],
    providers: [
        ProjectsService
    ]
})
export class ProjectsModule { }
