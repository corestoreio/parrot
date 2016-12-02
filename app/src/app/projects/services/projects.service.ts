import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { APIService } from './../../shared/api.service';
import { Project } from './../model/project';

@Injectable()
export class ProjectsService {

  private _projects = new BehaviorSubject([]);
  public projects = this._projects.asObservable();

  constructor(private api: APIService) { }

  fetchProjects(): Observable<Project[]> {
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

  fetchProject(id): Observable<Project> {
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

  createProject(project): Observable<Project> {
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

  addProjectKey(projectId: string, key: string): Observable<Project> {
    let request = this.api.request({
      uri: `/projects/${projectId}/keys`,
      method: 'POST',
      body: JSON.stringify({ key: key }),
    })
      .map(res => {
        let payload = res.payload;
        if (!payload) {
          throw new Error("no payload in response");
        }
        return payload;
      }).share();

    request.subscribe(
      project => {
        let projects = this._projects.getValue().map(_project => (_project.id === project.id) ? project : _project);
        this._projects.next(projects);
      });

    return request;
  }

  deleteProjectKey(projectId: string, key: string): Observable<Project> {
    let request = this.api.request({
      uri: `/projects/${projectId}/keys`,
      method: 'DELETE',
      body: JSON.stringify({ key: key }),
    })
      .map(res => {
        let payload = res.payload;
        if (!payload) {
          throw new Error("no payload in response");
        }
        return payload;
      }).share();

    request.subscribe(
      project => {
        let projects = this._projects.getValue().map(_project => (_project.id === project.id) ? project : _project);
        this._projects.next(projects);
      });

    return request;
  }

  updateProjectKey(projectId: string, oldKey: string, newKey: string): Observable<Project> {
    let request = this.api.request({
      uri: `/projects/${projectId}/keys`,
      method: 'PATCH',
      body: JSON.stringify({ oldKey: oldKey, newKey: newKey }),
    })
      .map(res => {
        let payload = res.payload;
        if (!payload) {
          throw new Error("no payload in response");
        }
        return payload;
      }).share();

    request.subscribe(
      project => {
        let projects = this._projects.getValue().map(_project => (_project.id === project.id) ? project : _project);
        this._projects.next(projects);
      });

    return request;
  }

  updateProjectKeys(projectId: string, keys): Observable<Project> {
    let request = this.api.request({
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

    request.subscribe(
      project => {
        let projects = this._projects.getValue().map(_project => (_project.id === project.id) ? project : _project);
        this._projects.next(projects);
      });

    return request;
  }
}
