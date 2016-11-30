import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { APIService } from './shared/api.service';
import { AuthModule, AuthGuard, UnauthGuard, AuthService } from './auth';
import { ProjectsModule } from './projects';
import { LocalesModule } from './locales';
import { HomePage, ProjectPage, LocalePage, ProjectKeysPage } from './pages';

@NgModule({
    imports: [
        // Core
        BrowserModule,
        CoreModule,

        // Routing
        AppRoutingModule,

        // App level modules
        AuthModule,
        ProjectsModule,
        LocalesModule,
    ],
    declarations: [
        AppComponent,
        HomePage,
        ProjectPage,
        LocalePage,
        ProjectKeysPage,
    ],
    providers: [APIService, AuthService, AuthGuard, UnauthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
