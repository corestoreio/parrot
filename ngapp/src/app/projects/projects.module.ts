import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsService } from './projects.service';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project/project.component';
import { CreateProjectComponent } from './create-project/create-project.component';

@NgModule({
    imports: [
        ProjectsRoutingModule,
        HttpModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        ProjectsComponent,
        ProjectComponent,
        CreateProjectComponent
    ],
    providers: [
        ProjectsService
    ]
})
export class ProjectsModule { }
