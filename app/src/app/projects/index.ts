import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { CoreModule } from './../core/core.module';
import { ProjectsService } from './services/projects.service';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectHeaderComponent } from './project-header/project-header.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectKeysComponent } from './project-keys/project-keys.component';
import { ProjectMenuComponent } from './project-menu/project-menu.component';
import { ProjectWrapperComponent } from './project-wrapper/project-wrapper.component';
import { CreateProjectKeyComponent } from './create-project-key/create-project-key.component';
import { EditProjectKeyComponent } from './edit-project-key/edit-project-key.component';
import { DeleteKeyComponent } from './delete-key/delete-key.component';

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
        ProjectHeaderComponent,
        CreateProjectComponent,
        ProjectKeysComponent,
        ProjectMenuComponent,
        ProjectWrapperComponent,
        CreateProjectKeyComponent,
        EditProjectKeyComponent,
        DeleteKeyComponent
    ],
    declarations: [
        ProjectsListComponent,
        ProjectHeaderComponent,
        CreateProjectComponent,
        ProjectKeysComponent,
        ProjectMenuComponent,
        ProjectWrapperComponent,
        CreateProjectKeyComponent,
        EditProjectKeyComponent,
        DeleteKeyComponent
    ],
    providers: [
        ProjectsService
    ]
})
export class ProjectsModule { }

export {
    ProjectsService,
    ProjectsListComponent,
    ProjectHeaderComponent,
    CreateProjectComponent,
    ProjectKeysComponent,
    ProjectMenuComponent,
    ProjectWrapperComponent,
    CreateProjectKeyComponent,
    EditProjectKeyComponent,
    DeleteKeyComponent
};
