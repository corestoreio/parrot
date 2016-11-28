import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../auth';

@Component({
    selector: 'appbar',
    templateUrl: 'appbar.component.html'
})
export class AppBarComponent implements OnInit {
    @Input()
    title;

    constructor(private auth: AuthService, private router: Router) { }

    ngOnInit() { }

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}