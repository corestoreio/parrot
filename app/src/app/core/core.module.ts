import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppBarComponent } from './appbar/appbar.component';

@NgModule({
    imports: [
        RouterModule.forChild([])
    ],
    exports: [
        AppBarComponent,
    ],
    declarations: [
        AppBarComponent,
    ],
    providers: [],
})
export class CoreModule {
    // Prevent reimport of core module
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule has already been loaded. Import Core modules in the AppModule only.');
        }
    }
}
