import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './../services/projects.service';

@Component({
  selector: 'projects-list',
  templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent implements OnInit {
  private projects;
  private loading = false;

  constructor(private projectsService: ProjectsService) {
    this.projects = [];
  }

  ngOnInit() {
    this.loading = true;
    this.projectsService.getProjects().subscribe(
      res => { this.projects = res; this.loading = false; },
      err => { console.log(err); this.loading = false; }
    )
  }
}
