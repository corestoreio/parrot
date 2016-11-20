import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './../services/projects.service';

@Component({
  selector: 'projects-list',
  templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent implements OnInit {
  private projects;

  constructor(private projectsService: ProjectsService) {
    this.projects = [];
  }

  ngOnInit() {
    this.projectsService.getProjects().subscribe(
      res => { this.projects = res; },
      err => { console.log(err); }
    )
  }
}
