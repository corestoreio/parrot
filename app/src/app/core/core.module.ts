import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ClarityModule } from 'clarity-angular';

import { AppBarComponent } from './appbar/appbar.component';
import { SideNavComponent } from './sidenav/sidenav.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './spinner/spinner.service';

@NgModule({
    imports: [ClarityModule],
    exports: [AppBarComponent, SideNavComponent, SpinnerComponent],
    declarations: [AppBarComponent, SideNavComponent, SpinnerComponent],
    providers: [SpinnerService],
})
export class CoreModule {
    // Prevent reimport of core module
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule has already been loaded. Import Core modules in the AppModule only.');
        }
    }
}
