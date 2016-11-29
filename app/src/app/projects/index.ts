import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ClarityModule } from 'clarity-angular';

import { CoreModule } from './../core/core.module';
import { ProjectsService } from './services/projects.service';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectKeysComponent } from './project-keys/project-keys.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild([]),
        HttpModule,
        ClarityModule,
        CoreModule
    ],
    exports: [
        ProjectsListComponent,
        ProjectDetailComponent,
        CreateProjectComponent,
        ProjectKeysComponent
    ],
    declarations: [
        ProjectsListComponent,
        ProjectDetailComponent,
        CreateProjectComponent,
        ProjectKeysComponent
    ],
    providers: [
        ProjectsService
    ]
})
export class ProjectsModule { }

export {
    ProjectsService,
    ProjectsListComponent,
    ProjectDetailComponent,
    CreateProjectComponent,
    ProjectKeysComponent
};
