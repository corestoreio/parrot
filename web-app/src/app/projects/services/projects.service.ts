import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { UserService } from './../../users/services/user.service';
import { APIService } from './../../shared/api.service';
import { Project } from './../model/project';

@Injectable()
export class ProjectsService {

  private _projects = new BehaviorSubject<Project[]>([]);
  public projects = this._projects.asObservable();

  private _activeProject = new BehaviorSubject<Project>(null);
  public activeProject = this._activeProject.asObservable();

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

  fetchProject(id: string): Observable<Project> {
    let request = this.api.request({
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

    request.subscribe(project => this._activeProject.next(project));

    return request;
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
        let projects = this._projects.getValue().map(current => (current.id === project.id) ? project : current);
        this._projects.next(projects);
        this._activeProject.next(project);
      });

    return request;
  }

  deleteProject(projectId: string): Observable<any> {
    let request = this.api.request({
      uri: `/projects/${projectId}`,
      method: 'DELETE'
    })
      .share();

    request.subscribe(
      () => {
        let projects = this._projects.getValue().filter(_project => _project.id !== projectId);
        this._projects.next(projects);
        this._activeProject.next(null);
      });

    return request;
  }

  deleteProjectKey(projectId: string, key: string): Observable<Project> {
    let request = this.api.request({
      uri: `/projects/${projectId}/keys/${key}`,
      method: 'DELETE'
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
        this._activeProject.next(project);
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
        let payload = res.payload.project;
        if (!payload) {
          throw new Error("no payload in response");
        }
        return payload;
      }).share();

    request.subscribe(
      project => {
        let projects = this._projects.getValue().map(_project => (_project.id === project.id) ? project : _project);
        this._projects.next(projects);
        this._activeProject.next(project);
      });

    return request;
  }

  updateProjectName(projectId: string, newName: string): Observable<Project> {
    let request = this.api.request({
      uri: `/projects/${projectId}/name`,
      method: 'PATCH',
      body: JSON.stringify({ projectId: projectId, name: newName }),
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
        this._activeProject.next(project);
      });

    return request;
  }
}
