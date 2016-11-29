import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { APIService } from './../../shared/api.service';

@Injectable()
export class ProjectsService {

  private _projects = new BehaviorSubject([]);
  public projects = this._projects.asObservable();

  constructor(private api: APIService) { }

  fetchProjects() {
    let request = this.api.request({
      uri: '/projects',
      method: 'GET',
    })
      .map(res => {
        let projects = res.payload;
        if (!projects) {
          throw new Error("no projects in response");
        }
        return projects;
      }).share();

    request.subscribe(
      projects => { this._projects.next(projects); }
    );

    return request;
  }

  fetchProject(id) {
    return this.api.request({
      uri: `/projects/${id}`,
      method: 'GET',
    })
      .map(res => {
        let project = res.payload;
        if (!project) {
          throw new Error("no project in response");
        }
        return project;
      }).share();
  }

  createProject(project) {
    let request = this.api.request({
      uri: '/projects',
      method: 'POST',
      body: JSON.stringify(project),
    })
      .map(res => {
        let project = res.payload;
        if (!project) {
          throw new Error("no project in response");
        }
        return project;
      }).share();

    request.subscribe(
      project => {
        let projects = this._projects.getValue().concat(project);
        this._projects.next(projects);
      });

    return request;
  }

  updateProjectKeys(projectId: number, keys) {
    return this.api.request({
      uri: `/projects/${projectId}/keys`,
      method: 'PATCH',
      body: JSON.stringify(keys),
    })
      .map(res => {
        let payload = res.payload;
        if (!payload) {
          throw new Error("no payload in response");
        }
        return payload;
      }).share();
  }
}
