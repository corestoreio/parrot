import { Component, OnInit, Input } from '@angular/core';

import { Application } from './../model/app';

@Component({
    selector: 'app-detail',
    templateUrl: 'app-detail.component.html',
    styleUrls: ['app-detail.component.css']
})
export class AppDetailComponent implements OnInit {
    @Input()
    private app: Application;

    constructor() { }

    ngOnInit() { }
}