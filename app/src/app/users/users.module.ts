import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AddProjectUserComponent } from './add-project-user/add-project-user.component';
import { EditProjectUserComponent } from './edit-project-user/edit-project-user.component';
import { ProjectUsersListComponent } from './project-users-list/project-users-list.component';
import { ProjectUsersService } from './services/project-users.service';
import { AccountDetailComponent } from './account-detail/account-detail.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild([]),
        HttpModule,
    ],
    exports: [
        ProjectUsersListComponent,
        AddProjectUserComponent,
        EditProjectUserComponent,
        AccountDetailComponent,
    ],
    declarations: [
        ProjectUsersListComponent,
        AddProjectUserComponent,
        EditProjectUserComponent,
        AccountDetailComponent,
    ],
    providers: [
        ProjectUsersService
    ]
})
export class UsersModule { }