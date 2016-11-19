import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalesService } from './services/locales.service';
import { LocalesListComponent } from './locales-list/locales-list.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LocalesListComponent
    ],
    providers: [
        LocalesService
    ]
})
export class LocalesModule { }

export { LocalesService, LocalesListComponent };