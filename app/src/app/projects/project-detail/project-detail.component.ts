import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectsService } from './../services/projects.service';

@Component({
	selector: 'project-detail',
	templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit {
	private project;

	constructor(private service: ProjectsService, private route: ActivatedRoute) { }

	ngOnInit() {
		this.fetchProject()
	}

	private fetchProject() {
		let id = +this.route.snapshot.params['projectId'];
		this.service.getProject(id).subscribe(
			res => { this.project = res },
			err => { console.log(err); }
		)
	}
}
