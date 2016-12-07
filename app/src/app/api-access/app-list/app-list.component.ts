import { Component, OnInit, Input } from '@angular/core';

import { Application } from './../model/app';

@Component({
    selector: 'app-list',
    templateUrl: 'app-list.component.html',
    styleUrls: ['app-list.component.css']
})
export class AppListComponent implements OnInit {
    @Input()
    private loading: boolean = false;
    @Input()
    private apps: Application[] = [];

    constructor() { }

    ngOnInit() { }
}