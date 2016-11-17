import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalesRoutingModule } from './locales-routing.module';
import { LocalesService } from './locales.service';
import { LocalesListComponent } from './locales-list/locales-list.component';

@NgModule({
    imports: [
        LocalesRoutingModule,
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
