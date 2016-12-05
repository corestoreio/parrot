import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Project } from './../model/project';

@Component({
    selector: 'parrot-project-menu',
    templateUrl: 'project-menu.component.html',
    styleUrls: ['project-menu.component.css']
})
export class ProjectMenuComponent implements OnInit {
    @Input()
    private project: Project;

    constructor() { }

    ngOnInit() { }
}