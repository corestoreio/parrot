import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import {TranslateModule} from '@ngx-translate/core';

import { AddProjectUserComponent } from './add-project-user/add-project-user.component';
import { EditProjectUserComponent } from './edit-project-user/edit-project-user.component';
import { ProjectUsersListComponent } from './project-users-list/project-users-list.component';
import { EditUserPasswordComponent } from './edit-user-password/edit-user-password.component';
import { EditUserNameComponent } from './edit-user-name/edit-user-name.component';
import { EditUserEmailComponent } from './edit-user-email/edit-user-email.component';

import { ProjectUsersService } from './services/project-users.service';
import { UserService } from './services/user.service';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule,
        RouterModule.forChild([]),
        HttpModule,
    ],
    exports: [
        ProjectUsersListComponent,
        AddProjectUserComponent,
        EditProjectUserComponent,
        EditUserPasswordComponent,
        EditUserNameComponent,
        EditUserEmailComponent,
    ],
    declarations: [
        ProjectUsersListComponent,
        AddProjectUserComponent,
        EditProjectUserComponent,
        EditUserPasswordComponent,
        EditUserNameComponent,
        EditUserEmailComponent,
    ],
    providers: [
        ProjectUsersService,
        UserService
    ]
})
export class UsersModule { }
