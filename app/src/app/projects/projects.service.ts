import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from './../auth/auth.service';
import { API_BASE_URL } from './../app.constants';

@Injectable()
export class ProjectsService {

  constructor(private http: Http, private auth: AuthService) { }

  getProjects() {
    return this.http.get(
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
      })
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
      })
  }

  createProject(project) {
    return this.http.post(
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
      })
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
      })
  }

  private getApiHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    return headers;
  }
}
