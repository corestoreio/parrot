import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LocalesRoutingModule } from './locales-routing.module';
import { LocalesService } from './locales.service';
import { LocalesComponent } from './locales.component';
import { AuthService } from './../auth.service';

@NgModule({
    imports: [
        LocalesRoutingModule,
        HttpModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        LocalesComponent
    ],
    providers: [
        LocalesService,
        AuthService
    ]
})
export class LocalesModule { }
