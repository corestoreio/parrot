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

}
