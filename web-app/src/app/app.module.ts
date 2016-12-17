import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { APIService } from './shared/api.service';
import { ErrorsService } from './shared/errors.service';
import { AuthModule, AuthGuard, UnauthGuard, AuthService } from './auth';
import { AuthorizedGuard } from './users/guards/authorized.guard';
import { UserService } from './users/services/user.service';
import { PagesModule } from './pages';

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
        PagesModule
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        APIService,
        AuthService,
        AuthGuard,
        UnauthGuard,
        AuthorizedGuard,
        UserService,
        ErrorsService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
