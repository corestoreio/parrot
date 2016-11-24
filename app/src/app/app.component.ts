import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth';
import { ProjectsService } from './projects';

@Component({
  selector: 'root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Parrot';
  private projects;
  private loading = false;

  constructor(private router: Router, private auth: AuthService, private projectsService: ProjectsService) { }

  ngOnInit() {
    this.projectsService.projects.subscribe(
      projects => { this.projects = projects; },
      err => { console.log(err); }
    );
    this.fetchProjects();
  }

  fetchProjects() {
    this.loading = true;
    this.projectsService.getProjects().subscribe(
      () => { },
      err => { console.log(err); },
      () => { this.loading = false; }
    );
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
