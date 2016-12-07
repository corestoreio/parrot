import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppDetailComponent } from './app-detail/app-detail.component';
import { AppListComponent } from './app-list/app-list.component';
import { APIAccessService } from './services/api-access.service';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild([]),
        HttpModule,
    ],
    exports: [
        AppDetailComponent,
        AppListComponent,
    ],
    declarations: [
        AppDetailComponent,
        AppListComponent,
    ],
    providers: [
        APIAccessService
    ]
})
export class APIAccessModule { }

export {
    AppDetailComponent,
    AppListComponent,
    APIAccessService
};
