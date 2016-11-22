import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from './../../auth';
import { API_BASE_URL } from './../../app.constants';

@Injectable()
export class ProjectsService {

  private _projects = new BehaviorSubject([]);
  public projects = this._projects.asObservable();

  constructor(private http: Http, private auth: AuthService) { }

  getProjects() {
    let request = this.http.get(
      `${API_BASE_URL}/projects`,
      { headers: this.getApiHeaders() }
    )
      .map(res => res.json())
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

  getProject(id) {
    return this.http.get(
      `${API_BASE_URL}/projects/${id}`,
      { headers: this.getApiHeaders() }
    )
      .map(res => res.json())
      .map(res => {
        let project = res.payload;
        if (!project) {
          throw new Error("no project in response");
        }
        return project;
      }).share();
  }

  createProject(project) {
    let request = this.http.post(
      `${API_BASE_URL}/projects`,
      JSON.stringify(project),
      { headers: this.getApiHeaders() }
    )
      .map(res => res.json())
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
    return this.http.patch(
      `${API_BASE_URL}/projects/${projectId}/keys`,
      JSON.stringify(keys),
      { headers: this.getApiHeaders() }
    )
      .map(res => res.json())
      .map(res => {
        let payload = res.payload;
        if (!payload) {
          throw new Error("no payload in response");
        }
        return payload;
      }).share();
  }

  private getApiHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    return headers;
  }
}
