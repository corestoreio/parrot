import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LocalesService } from './services/locales.service';
import { LocalesListComponent } from './locales-list/locales-list.component';
import { CreateLocaleComponent } from './create-locale/create-locale.component';
import { LocalePairsComponent } from './locale-pairs/locale-pairs.component';

import { ObjectToPairsPipe } from './pipes/object-to-pairs.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([]),
        HttpModule,
    ],
    declarations: [
        LocalesListComponent,
        CreateLocaleComponent,
        LocalePairsComponent,
        ObjectToPairsPipe
    ],
    exports: [
        LocalesListComponent,
        CreateLocaleComponent,
        LocalePairsComponent
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
    LocalePairsComponent
};