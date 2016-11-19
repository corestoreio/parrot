import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LocalesService } from './services/locales.service';
import { LocalesListComponent } from './locales-list/locales-list.component';
import { CreateLocaleComponent } from './create-locale/create-locale.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        LocalesListComponent,
        CreateLocaleComponent
    ],
    exports: [
        LocalesListComponent,
        CreateLocaleComponent
    ],
    providers: [
        LocalesService
    ]
})
export class LocalesModule { }

export {
    LocalesService,
    LocalesListComponent,
    CreateLocaleComponent
};