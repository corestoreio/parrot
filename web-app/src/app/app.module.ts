import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {Http} from '@angular/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { APIService } from './shared/api.service';
import { ErrorsService } from './shared/errors.service';
import { AuthModule, AuthGuard, UnauthGuard, AuthService } from './auth';
import { AuthorizedGuard } from './users/guards/authorized.guard';
import { UserService } from './users/services/user.service';
import { PagesModule } from './pages';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
        PagesModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        })
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
