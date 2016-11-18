import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { UnauthGuard } from './auth/unauth.guard';

import { ProjectsModule } from './projects/projects.module';
import { LocalesModule } from './locales/locales.module';

import { HomePageComponent } from './pages/home/home-page.component';

import { MaterialModule } from '@angular/material';

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AuthModule,
        AppRoutingModule,
        ProjectsModule,
        LocalesModule,
        MaterialModule.forRoot()
    ],
    providers: [AuthService, AuthGuard, UnauthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
