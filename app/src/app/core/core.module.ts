import { NgModule } from '@angular/core';
import { ClarityModule } from 'clarity-angular';

import { AppBarComponent } from './appbar/appbar.component';
import { SideNavComponent } from './sidenav/sidenav.component';

@NgModule({
    imports: [ClarityModule],
    exports: [AppBarComponent, SideNavComponent],
    declarations: [AppBarComponent, SideNavComponent],
    providers: [],
})
export class CoreModule { }
