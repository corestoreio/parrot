import { Component, Input } from '@angular/core';

import { Project } from './../model/project';

@Component({
	selector: 'project-header',
	templateUrl: './project-header.component.html'
})
export class ProjectHeaderComponent {
	@Input()
	private project: Project;
	@Input()
	private loading: boolean;
}
