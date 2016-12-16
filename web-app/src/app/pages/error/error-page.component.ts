import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'error-page',
    templateUrl: 'error-page.component.html',
    styleUrls: ['error-page.component.css'],
})
export class ErrorPage implements OnInit {

    private title: string;
    private message: string;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams.subscribe(
            params => {
                this.title = params['error'];
                this.message = params['message'];
            }
        );
    }
}