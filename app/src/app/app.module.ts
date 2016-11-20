import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from 'clarity-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule, AuthGuard, UnauthGuard, AuthService } from './auth';
import { ProjectsModule } from './projects';
import { LocalesModule } from './locales';
import { HomePageComponent, ProjectPageComponent, LocalePageComponent } from './pages';

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        ProjectPageComponent,
        LocalePageComponent,
    ],
    imports: [
        // Core
        BrowserModule,

        // Routing
        AppRoutingModule,

        // App level modules
        AuthModule,
        ProjectsModule,
        LocalesModule,

        // UI module
        ClarityModule
    ],
    providers: [AuthService, AuthGuard, UnauthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
