import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LocalesService } from './services/locales.service';
import { LocalesListComponent } from './locales-list/locales-list.component';
import { CreateLocaleComponent } from './create-locale/create-locale.component';
import { LocaleDetailComponent } from './locale-detail/locale-detail.component';

import { ObjectToPairsPipe } from './pipes/object-to-pairs.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        HttpModule
    ],
    declarations: [
        LocalesListComponent,
        CreateLocaleComponent,
        LocaleDetailComponent,
        ObjectToPairsPipe
    ],
    exports: [
        LocalesListComponent,
        CreateLocaleComponent,
        LocaleDetailComponent
    ],
    providers: [
        LocalesService
    ]
})
export class LocalesModule { }

export {
    LocalesService,
    LocalesListComponent,
    CreateLocaleComponent,
    LocaleDetailComponent
};