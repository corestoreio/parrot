import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from './../../users/services/user.service';
import { Project } from './../model/project';
import { ProjectMenuService } from './../../core/services/project-menu.service';

@Component({
    selector: 'parrot-project-menu',
    templateUrl: 'project-menu.component.html',
    styleUrls: ['project-menu.component.css']
})
export class ProjectMenuComponent implements OnInit {
    @Input()
    private project: Project;

    private menuActive: boolean;
    private adminSectionVisible: boolean;
    private developerSectionVisible: boolean;

    constructor(
        private projectMenuService: ProjectMenuService,
        private userService: UserService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.params
            .map(params => params['projectId'])
            .subscribe(projectId => {
                this.userService.isAuthorized(projectId, 'CanViewProjectRoles')
                    .subscribe(ok => this.adminSectionVisible = ok);
                this.userService.isAuthorized(projectId, 'CanManageAPIClients')
                    .subscribe(ok => this.developerSectionVisible = ok);
            });
        this.projectMenuService.menuActive
            .subscribe(active => this.menuActive = active);
    }

    closeMenu() {
        this.projectMenuService.setInactive();
    }
}