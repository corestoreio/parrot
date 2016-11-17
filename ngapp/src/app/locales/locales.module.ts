import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalesRoutingModule } from './locales-routing.module';
import { LocalesService } from './locales.service';
import { LocalesComponent } from './locales.component';

@NgModule({
    imports: [
        LocalesRoutingModule,
        CommonModule
    ],
    declarations: [
        LocalesComponent
    ],
    providers: [
        LocalesService
    ]
})
export class LocalesModule { }
