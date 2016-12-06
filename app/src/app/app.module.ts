import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { APIService } from './shared/api.service';
import { AuthModule, AuthGuard, UnauthGuard, AuthService } from './auth';
import { ProjectsModule } from './projects';
import { LocalesModule } from './locales';
import { UsersModule } from './users';
import { HomePage, ProjectLocalesPage, LocalePage, ProjectKeysPage, ProjectTeamPage } from './pages';

@NgModule({
    imports: [
        // Core
        BrowserModule,
        CoreModule,
        FormsModule,

        // Routing
        AppRoutingModule,

        // App level modules
        AuthModule,
        ProjectsModule,
        LocalesModule,
        UsersModule,
    ],
    declarations: [
        AppComponent,
        HomePage,
        ProjectLocalesPage,
        LocalePage,
        ProjectKeysPage,
        ProjectTeamPage
    ],
    providers: [APIService, AuthService, AuthGuard, UnauthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
