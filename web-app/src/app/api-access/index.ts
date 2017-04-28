import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import {TranslateModule} from '@ngx-translate/core';

import { AppDetailComponent } from './app-detail/app-detail.component';
import { AppListComponent } from './app-list/app-list.component';
import { APIAccessService } from './services/api-access.service';
import { RegisterAppComponent } from './register-app/register-app.component';
import { DeleteAppComponent } from './delete-app/delete-app.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule,
        RouterModule.forChild([]),
        HttpModule,
    ],
    exports: [
        AppDetailComponent,
        AppListComponent,
        RegisterAppComponent,
        DeleteAppComponent,
    ],
    declarations: [
        AppDetailComponent,
        AppListComponent,
        RegisterAppComponent,
        DeleteAppComponent,
    ],
    providers: [
        APIAccessService
    ]
})
export class APIAccessModule { }

export {
    AppDetailComponent,
    AppListComponent,
    RegisterAppComponent,
    DeleteAppComponent,
    APIAccessService
};
