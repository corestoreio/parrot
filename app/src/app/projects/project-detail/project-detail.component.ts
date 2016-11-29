import { Component, Input } from '@angular/core';

@Component({
	selector: 'project-detail',
	templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent {
	@Input()
	private project;
	@Input()
	private loading;
}
