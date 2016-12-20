import { Component, OnInit, Input } from '@angular/core';

import { ProjectUser } from './../model';

@Component({
    selector: 'project-users-list',
    templateUrl: 'project-users-list.component.html',
    styleUrls: ['project-users-list.component.css']
})
export class ProjectUsersListComponent implements OnInit {
    @Input()
    private users: ProjectUser[];
    @Input()
    private canUpdateRoles: boolean;
    @Input()
    private loading: boolean;
    @Input()
    private projectId: string;

    constructor() { }

    ngOnInit() { }
}