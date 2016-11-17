import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './../projects.service';

@Component({
  selector: 'projects-list',
  templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent implements OnInit {
  projects;
  loading: boolean;

  constructor(private projectsService: ProjectsService) {
    this.projects = [];
    this.loading = false;
  }

  ngOnInit() {
    this.getProjects();
    this.createProject = this.createProject.bind(this);
  }

  getProjects() {
    this.loading = true;
    this.projectsService.getProjects().subscribe(
      res => {
        this.projects = res;
        this.loading = false;
      },
      err => {
        // TODO
        this.loading = false;
      }
    );
  }

  createProject(project) {
    this.projectsService.createProject(project).subscribe(
      res => {
        this.projects = this.projects.concat(res);
      },
      err => {
        // TODO
      }
    );
  }

}
