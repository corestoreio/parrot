import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';

import { AppBarComponent } from './appbar/appbar.component';
import { ProjectMenuService } from './services/project-menu.service';

@NgModule({
    imports: [
        TranslateModule,
        RouterModule.forChild([])
    ],
    exports: [
        AppBarComponent
    ],
    declarations: [
        AppBarComponent,
    ],
    providers: [ProjectMenuService],
})
export class CoreModule {
    // Prevent reimport of core module
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule has already been loaded. Import Core modules in the AppModule only.');
        }
    }
}
