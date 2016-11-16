import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './../projects.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  private project;

  constructor(private service: ProjectsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchProject()
  }

  private fetchProject() {
    let id = +this.route.snapshot.params['id'];
    this.service.getProject(id).subscribe(
      res => { this.project = res },
      err => { }
    )
  }
}
