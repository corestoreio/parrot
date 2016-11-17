import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectsService } from './../projects.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {
  private project;

  constructor(private service: ProjectsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchProject()
  }

  private fetchProject() {
    let id = +this.route.snapshot.params['projectId'];
    this.service.getProject(id).subscribe(
      res => { this.project = res },
      err => { }
    )
  }
}
