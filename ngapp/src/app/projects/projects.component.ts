import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects;

  constructor(private projectsService: ProjectsService) {
    this.projects = [];
  }

  ngOnInit() {
    this.getProjects();
    this.createProject = this.createProject.bind(this);
  }

  getProjects() {
    this.projectsService.getProjects().subscribe(
      res => {
        this.projects = res;
      },
      err => {
        // TODO
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
