import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './../services/projects.service';

@Component({
  selector: 'projects-list',
  templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent implements OnInit {
  private projects = [];
  private loading = false;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    this.projectsService.projects.subscribe(
      projects => { this.projects = projects }
    );
    this.fetchProjects();
  }

  fetchProjects() {
    this.loading = true;
    this.projectsService.getProjects().subscribe(
      () => { },
      err => { console.log(err); },
      () => { this.loading = false; }
    )
  }
}
