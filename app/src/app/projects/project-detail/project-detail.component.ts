import { Component, Input } from '@angular/core';

import { Project } from './../model/project';

@Component({
	selector: 'project-detail',
	templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent {
	@Input()
	private project: Project;
	@Input()
	private loading: boolean;
}
