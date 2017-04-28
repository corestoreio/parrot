import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core'

import { LocalesService } from './services/locales.service';
import { LocalesListComponent } from './locales-list/locales-list.component';
import { CreateLocaleComponent } from './create-locale/create-locale.component';
import { LocalePairsComponent } from './locale-pairs/locale-pairs.component';
import { EditableTextFieldComponent } from './editable-textfield/editable-textfield.component';
import { DeleteLocaleComponent } from './delete-locale/delete-locale.component';

import { ExportLocaleComponent } from './export-locale/export-locale.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule.forChild([]),
        HttpModule,
    ],
    declarations: [
        LocalesListComponent,
        CreateLocaleComponent,
        LocalePairsComponent,
        ExportLocaleComponent,
        EditableTextFieldComponent,
        DeleteLocaleComponent,
    ],
    exports: [
        LocalesListComponent,
        CreateLocaleComponent,
        LocalePairsComponent,
        ExportLocaleComponent,
        EditableTextFieldComponent,
        DeleteLocaleComponent,
    ],
    providers: [
        LocalesService
    ]
})
export class LocalesModule { }
