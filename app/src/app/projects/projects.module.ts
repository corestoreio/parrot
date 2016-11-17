import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProjectsService } from './projects.service';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { CreateProjectComponent } from './create-project/create-project.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule
    ],
    exports: [
        ProjectsListComponent,
        ProjectDetailComponent,
        CreateProjectComponent
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
