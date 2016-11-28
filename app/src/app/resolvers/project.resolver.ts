import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ProjectsService } from './../projects/services/projects.service';

@Injectable()
export class ProjectResolver implements Resolve<any> {

    constructor(private projectsService: ProjectsService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this.projectsService.fetchProject(route.params['projectId']);
    }
}