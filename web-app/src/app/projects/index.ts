import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import {TranslateModule} from '@ngx-translate/core';

import { CoreModule } from './../core/core.module';
import { ProjectsService } from './services/projects.service';

import { ProjectsListComponent } from './projects-list/projects-list.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectKeysComponent } from './project-keys/project-keys.component';
import { ProjectMenuComponent } from './project-menu/project-menu.component';
import { ProjectWrapperComponent } from './project-wrapper/project-wrapper.component';
import { CreateProjectKeyComponent } from './create-project-key/create-project-key.component';
import { EditProjectKeyComponent } from './edit-project-key/edit-project-key.component';
import { EditProjectNameComponent } from './edit-project-name/edit-project-name.component';
import { DeleteProjectKeyComponent } from './delete-project-key/delete-project-key.component';
import { DeleteProjectComponent } from './delete-project/delete-project.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule,
        RouterModule.forChild([]),
        HttpModule,
        CoreModule
    ],
    exports: [
        ProjectsListComponent,
        CreateProjectComponent,
        ProjectKeysComponent,
        ProjectMenuComponent,
        ProjectWrapperComponent,
        CreateProjectKeyComponent,
        EditProjectKeyComponent,
        DeleteProjectKeyComponent,
        EditProjectNameComponent,
        DeleteProjectComponent
    ],
    declarations: [
        ProjectsListComponent,
        CreateProjectComponent,
        ProjectKeysComponent,
        ProjectMenuComponent,
        ProjectWrapperComponent,
        CreateProjectKeyComponent,
        EditProjectKeyComponent,
        DeleteProjectKeyComponent,
        EditProjectNameComponent,
        DeleteProjectComponent
    ],
    providers: [
        ProjectsService,
    ]
})
export class ProjectsModule { }

export {
    ProjectsService,
    ProjectsListComponent,
    CreateProjectComponent,
    ProjectKeysComponent,
    ProjectMenuComponent,
    ProjectWrapperComponent,
    CreateProjectKeyComponent,
    EditProjectKeyComponent,
    DeleteProjectKeyComponent,
    EditProjectNameComponent
};
