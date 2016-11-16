import { NgModule } from '@angular/core';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsService } from './projects.service';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project/project.component';
import { AuthService } from './../auth.service';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        ProjectsRoutingModule,
        HttpModule,
        FormsModule,
        BrowserModule
    ],
    declarations: [
        ProjectsComponent,
        ProjectComponent,
    ],
    providers: [
        ProjectsService,
        AuthService
    ]
})
export class ProjectsModule { }
