import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../auth';

@Component({
    selector: 'appbar',
    templateUrl: 'appbar.component.html',
    styleUrls: ['appbar.component.css']
})
export class AppBarComponent implements OnInit {
    @Input()
    title: string;

    private isMenuActive: boolean;

    constructor(private auth: AuthService, private router: Router) { }

    ngOnInit() { }

    toggleMenu() {
        this.isMenuActive = !this.isMenuActive;
    }

    closeMenu() {
        this.isMenuActive = false;
    }

    get logoutVisible() {
        return this.auth.isLoggedIn();
    }

    logout(): void {
        this.auth.removeToken();
        this.router.navigate(['/login']);
    }
}