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

    constructor(private auth: AuthService, private router: Router) { }

    ngOnInit() { }

    logout(): void {
        this.auth.removeToken();
        this.router.navigate(['/login']);
    }
}