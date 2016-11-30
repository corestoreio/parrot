import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { CoreModule } from './../core/core.module';
import { ProjectsService } from './services/projects.service';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectKeysComponent } from './project-keys/project-keys.component';
import { ProjectMenuComponent } from './project-menu/project-menu.component';
import { ProjectWrapperComponent } from './project-wrapper/project-wrapper.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild([]),
        HttpModule,
        CoreModule
    ],
    exports: [
        ProjectsListComponent,
        ProjectDetailComponent,
        CreateProjectComponent,
        ProjectKeysComponent,
        ProjectMenuComponent,
        ProjectWrapperComponent
    ],
    declarations: [
        ProjectsListComponent,
        ProjectDetailComponent,
        CreateProjectComponent,
        ProjectKeysComponent,
        ProjectMenuComponent,
        ProjectWrapperComponent
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
    ProjectKeysComponent,
    ProjectMenuComponent,
    ProjectWrapperComponent
};
