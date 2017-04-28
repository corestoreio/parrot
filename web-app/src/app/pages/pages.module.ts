import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import {TranslateModule} from '@ngx-translate/core';

import { ProjectsModule } from './../projects';
import { LocalesModule } from './../locales/locales.module';
import { UsersModule } from './../users';
import { APIAccessModule } from './../api-access';

import { HomePage } from './home/home-page.component';
import { ProjectSettingsPage } from './project-settings/project-settings-page.component';
import { ProjectLocalesPage } from './project-locales/project-locales-page.component';
import { ProjectKeysPage } from './project-keys/project-keys-page.component';
import { LocalePage } from './project-locale/locale-page.component';
import { ProjectTeamPage } from './project-team/project-team-page.component';
import { APIAccessPage } from './api-access/api-access-page.component';
import { APIAppPage } from './api-app/api-app-page.component';
import { ErrorPage } from './error/error-page.component';
import { AccountPage } from './account/account-page.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild([]),
        HttpModule,
        TranslateModule,

        ProjectsModule,
        LocalesModule,
        UsersModule,
        APIAccessModule,
    ],
    exports: [
        HomePage,
        ProjectLocalesPage,
        LocalePage,
        ProjectKeysPage,
        ProjectTeamPage,
        APIAppPage,
        APIAccessPage,
        AccountPage,
        ErrorPage,
        ProjectSettingsPage,
    ],
    declarations: [
        HomePage,
        ProjectLocalesPage,
        LocalePage,
        ProjectKeysPage,
        ProjectTeamPage,
        APIAppPage,
        APIAccessPage,
        AccountPage,
        ErrorPage,
        ProjectSettingsPage,
    ],
    providers: [],
})
export class PagesModule { }
